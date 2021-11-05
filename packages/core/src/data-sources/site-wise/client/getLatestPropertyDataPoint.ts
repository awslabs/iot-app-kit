import { GetAssetPropertyValueCommand, IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { SiteWiseDataStreamQuery } from '../types';
import { toDataPoint } from '../util/toDataPoint';
import { isDefined } from '../../../common/predicates';
import { dataStreamFromSiteWise } from '../dataStreamFromSiteWise';
import { DataStreamCallback } from '../../../data-module/types';

export const getLatestPropertyDataPoint = async ({
  query: { assets },
  onSuccess,
  onError,
  client,
}: {
  query: SiteWiseDataStreamQuery;
  onSuccess: DataStreamCallback;
  onError: Function;
  client: IoTSiteWiseClient;
}): Promise<void> => {
  const requests = assets
    .map(({ assetId, propertyIds }) =>
      propertyIds.map((propertyId) =>
        client.send(new GetAssetPropertyValueCommand({ assetId, propertyId })).then((res) => ({
          dataPoints: [toDataPoint(res.propertyValue)].filter(isDefined),
          assetId,
          propertyId,
        }))
      )
    )
    .flat();

  await Promise.all(requests)
    .then((results) => {
      const dataStreams = results.map(dataStreamFromSiteWise);
      onSuccess(dataStreams);
    })
    .catch((errorMessage: string) => {
      onError(errorMessage);
    });
};
