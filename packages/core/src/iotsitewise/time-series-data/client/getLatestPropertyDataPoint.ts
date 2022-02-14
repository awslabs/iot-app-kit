import { GetAssetPropertyValueCommand, IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { SiteWiseDataStreamQuery } from '../types';
import { toDataPoint } from '../util/toDataPoint';
import { isDefined } from '../../../common/predicates';
import { dataStreamFromSiteWise } from '../dataStreamFromSiteWise';
import { DataStreamCallback, ErrorCallback, RequestInformationAndRange } from '../../../data-module/types';
import { toDataStreamId } from '../util/dataStreamId';

export const getLatestPropertyDataPoint = async ({
  query: { assets },
  onSuccess,
  onError,
  client,
  requestInformations,
}: {
  query: SiteWiseDataStreamQuery;
  onSuccess: DataStreamCallback;
  onError: ErrorCallback;
  client: IoTSiteWiseClient;
  requestInformations: RequestInformationAndRange[];
}): Promise<void> => {
  const dataStreamQueries = assets
    .map(({ assetId, properties }) =>
      properties.map(({ propertyId, resolution }) => ({ assetId, propertyId, resolution }))
    )
    .flat();

  const requests = requestInformations
    .sort((a, b) => b.start.getTime() - a.start.getTime())
    .map(({ id, start, end }) => {
      const dataStreamsToRequest = dataStreamQueries.find(
        ({ assetId, propertyId }) => toDataStreamId({ assetId, propertyId }) === id
      );

      if (dataStreamsToRequest) {
        const { assetId, propertyId } = dataStreamsToRequest;

        return client
          .send(new GetAssetPropertyValueCommand({ assetId, propertyId }))
          .then((res) => ({
            dataPoints: [toDataPoint(res.propertyValue)].filter(isDefined),
            assetId,
            propertyId,
          }))
          .catch((err) => {
            const dataStreamId = toDataStreamId({ assetId, propertyId });
            onError({
              id: dataStreamId,
              resolution: 0,
              error: { msg: err.message, type: err.name, status: err.$metadata?.httpStatusCode },
            });
            return undefined;
          });
      }
    });

  try {
    await Promise.all(requests).then((results) => {
      const dataStreams = results.filter(isDefined).map(dataStreamFromSiteWise);
      if (dataStreams.length > 0) {
        onSuccess(dataStreams);
      }
    });
  } catch {
    // NOOP
  }
};
