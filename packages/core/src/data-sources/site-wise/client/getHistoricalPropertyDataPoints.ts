import { GetAssetPropertyValueHistoryCommand, IoTSiteWiseClient, TimeOrdering } from '@aws-sdk/client-iotsitewise';
import { AssetId, AssetPropertyId, SiteWiseDataStreamQuery } from '../types';
import { toDataPoint } from '../util/toDataPoint';
import { dataStreamFromSiteWise } from '../dataStreamFromSiteWise';
import { DataStreamCallback } from '../../../data-module/types';
import { isDefined } from '../../../common/predicates';

const getHistoricalPropertyDataPointsForProperty = ({
  assetId,
  propertyId,
  start,
  end,
  maxResults,
  onSuccess,
  nextToken: prevToken,
  client,
}: {
  assetId: AssetId;
  propertyId: AssetPropertyId;
  start: Date;
  end: Date;
  maxResults?: number;
  onSuccess: DataStreamCallback;
  client: IoTSiteWiseClient;
  nextToken?: string;
}) => {
  return client
    .send(
      new GetAssetPropertyValueHistoryCommand({
        assetId,
        propertyId,
        startDate: start,
        endDate: end,
        maxResults,
        timeOrdering: TimeOrdering.ASCENDING,
        nextToken: prevToken,
      })
    )
    .then(({ assetPropertyValueHistory, nextToken }) => {
      if (assetPropertyValueHistory) {
        /** Report the page of data to the data-module */
        const dataPoints = assetPropertyValueHistory
          .map((assetPropertyValue) => toDataPoint(assetPropertyValue))
          .filter(isDefined);

        onSuccess([dataStreamFromSiteWise({ assetId, propertyId, dataPoints })]);
      }

      if (nextToken) {
        getHistoricalPropertyDataPointsForProperty({
          assetId,
          propertyId,
          start,
          end,
          maxResults,
          onSuccess,
          nextToken,
          client,
        });
      }
    });
};

export const getHistoricalPropertyDataPoints = async ({
  client,
  query,
  start,
  end,
  maxResults,
  onSuccess,
  onError,
}: {
  query: SiteWiseDataStreamQuery;
  start: Date;
  end: Date;
  maxResults?: number;
  onError: Function;
  onSuccess: DataStreamCallback;
  client: IoTSiteWiseClient;
}) => {
  const requests = query.assets
    .map(({ assetId, propertyIds }) =>
      propertyIds.map((propertyId) =>
        getHistoricalPropertyDataPointsForProperty({
          client,
          assetId,
          propertyId,
          start,
          end,
          maxResults,
          onSuccess,
        })
      )
    )
    .flat();

  await Promise.all(requests).catch((err) => {
    onError(err);
  });
};
