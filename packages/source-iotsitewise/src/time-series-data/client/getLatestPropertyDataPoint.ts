import { GetAssetPropertyValueCommand, IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { toDataPoint } from '../util/toDataPoint';
import { dataStreamFromSiteWise } from '../dataStreamFromSiteWise';
import { OnSuccessCallback, ErrorCallback, RequestInformationAndRange } from '@iot-app-kit/core';
import { toId, toSiteWiseAssetProperty } from '../util/dataStreamId';
import { isDefined } from '../../common/predicates';

export const getLatestPropertyDataPoint = async ({
  onSuccess,
  onError,
  client,
  requestInformations,
}: {
  onSuccess: OnSuccessCallback;
  onError: ErrorCallback;
  client: IoTSiteWiseClient;
  requestInformations: RequestInformationAndRange[];
}): Promise<void> => {
  const end = new Date();
  const requests = requestInformations
    .filter(({ resolution }) => resolution === '0')
    .sort((a, b) => b.start.getTime() - a.start.getTime())
    .map(({ id, start, end }) => {
      const { assetId, propertyId } = toSiteWiseAssetProperty(id);

      return client
        .send(new GetAssetPropertyValueCommand({ assetId, propertyId }))
        .then((res) => ({
          dataPoints: [toDataPoint(res.propertyValue)].filter(isDefined),
          assetId,
          propertyId,
        }))
        .catch((err) => {
          const dataStreamId = toId({ assetId, propertyId });
          onError({
            id: dataStreamId,
            resolution: 0,
            error: { msg: err.message, type: err.name, status: err.$metadata?.httpStatusCode },
          });
          return undefined;
        });
    });

  try {
    await Promise.all(requests).then((results) => {
      results
        .filter(isDefined)
        .map(dataStreamFromSiteWise)
        .forEach((dataStream) => {
          const lastDataPoint = dataStream.data.slice(-1)[0];
          const start = lastDataPoint ? new Date(lastDataPoint.x) : new Date(0, 0, 0);
          onSuccess([dataStream], 'fetchMostRecentBeforeEnd', start, end);
        });
    });
  } catch {
    // NOOP
  }
};
