import { DataPoint, DataStream, DataType } from '@synchro-charts/core';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { DataSource } from '../../data-module/types.d';
import { AssetId, AssetPropertyId, SiteWiseDataStreamQuery } from './types.d';
import { SiteWiseClient } from './client';
import { toDataStreamId } from './util/dataStreamId';

const toDataStream = ({
  assetId,
  propertyId,
  dataPoint,
}: {
  assetId: AssetId;
  propertyId: AssetPropertyId;
  dataPoint: DataPoint | undefined;
}): DataStream => ({
  name: toDataStreamId({ assetId, propertyId }),
  id: toDataStreamId({ assetId, propertyId }),
  data: dataPoint ? [dataPoint] : [],
  resolution: 0,
  // TODO: Better support for various data types, will need to utilize associated asset information to infer.
  dataType: typeof dataPoint?.y === 'string' ? DataType.STRING : DataType.NUMBER,
});

export const DATA_SOURCE_NAME = 'site-wise';

export const createDataSource = (siteWise: IoTSiteWiseClient): DataSource<SiteWiseDataStreamQuery> => {
  const client = new SiteWiseClient(siteWise);
  return {
    name: DATA_SOURCE_NAME,
    initiateRequest: ({ query: { assets }, onSuccess, onError }) => {
      const requests = assets
        .map(({ assetId, propertyIds }) =>
          propertyIds.map((propertyId) =>
            // TODO: Support more than just getting the latest data point
            //   must also support fetching fetching historical data ranges.
            client.getLatestPropertyDataPoint({ assetId, propertyId }).then((dataPoint) => ({
              dataPoint,
              assetId,
              propertyId,
            }))
          )
        )
        .flat();

      Promise.all(requests)
        .then((results) => {
          const dataStreams = results.map(toDataStream);
          onSuccess(dataStreams);
        })
        .catch((errorMessage: string) => {
          onError(errorMessage);
        });
    },
    getRequestsFromQuery: (query: SiteWiseDataStreamQuery) =>
      query.assets.flatMap(({ assetId, propertyIds }) =>
        propertyIds.map((propertyId) => ({
          id: toDataStreamId({ assetId, propertyId }),
          resolution: 0,
        }))
      ),
  };
};
