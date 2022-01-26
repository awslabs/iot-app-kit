import { GetAssetPropertyValueCommand, IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { SiteWiseDataStreamQuery } from '../types';
import { toDataPoint } from '../util/toDataPoint';
import { isDefined } from '../../../common/predicates';
import { dataStreamFromSiteWise } from '../dataStreamFromSiteWise';
import { DataStreamCallback, ErrorCallback } from '../../../data-module/types';
import { toDataStreamId } from '../util/dataStreamId';

export const getLatestPropertyDataPoint = async ({
  query: { assets },
  onSuccess,
  onError,
  client,
}: {
  query: SiteWiseDataStreamQuery;
  onSuccess: DataStreamCallback;
  onError: ErrorCallback;
  client: IoTSiteWiseClient;
}): Promise<void> => {
  const requests = assets
    .map(({ assetId, properties }) =>
      properties.map(({ propertyId }) => {
        return client
          .send(new GetAssetPropertyValueCommand({ assetId, propertyId }))
          .then((res) => ({
            dataPoints: [toDataPoint(res.propertyValue)].filter(isDefined),
            assetId,
            propertyId,
          }))
          .catch((error) => {
            const dataStreamId = toDataStreamId({ assetId, propertyId });
            onError({ id: dataStreamId, resolution: 0, error: error.message });
            return undefined;
          });
      })
    )
    .flat();

  await Promise.all(requests).then((results) => {
    const dataStreams = results.filter(isDefined).map(dataStreamFromSiteWise);
    if (dataStreams.length > 0) {
      onSuccess(dataStreams);
    }
  });
};
