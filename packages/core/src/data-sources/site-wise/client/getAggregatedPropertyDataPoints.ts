import {
  GetAssetPropertyAggregatesCommand,
  IoTSiteWiseClient,
  TimeOrdering,
  AggregateType,
} from '@aws-sdk/client-iotsitewise';
import { AssetId, AssetPropertyId, SiteWiseDataStreamQuery } from '../types';
import { aggregateToDataPoint } from '../util/toDataPoint';
import { dataStreamFromSiteWise } from '../dataStreamFromSiteWise';
import { DataStreamCallback } from '../../../data-module/types';
import { isDefined } from '../../../common/predicates';

const getAggregatedPropertyDataPointsForProperty = ({
  assetId,
  propertyId,
  start,
  end,
  resolution,
  aggregateTypes,
  maxResults,
  onSuccess,
  nextToken: prevToken,
  client,
}: {
  assetId: AssetId;
  propertyId: AssetPropertyId;
  start: Date;
  end: Date;
  resolution: string;
  aggregateTypes: AggregateType[];
  maxResults?: number;
  onSuccess: DataStreamCallback;
  client: IoTSiteWiseClient;
  nextToken?: string;
}) => {
  return client
    .send(
      new GetAssetPropertyAggregatesCommand({
        assetId,
        propertyId,
        startDate: start,
        endDate: end,
        resolution,
        aggregateTypes,
        maxResults,
        timeOrdering: TimeOrdering.ASCENDING,
        nextToken: prevToken,
      })
    )
    .then(({ aggregatedValues, nextToken }) => {
      if (aggregatedValues) {
        /** Report the page of data to the data-module */
        const dataPoints = aggregatedValues
          .map((assetPropertyValue) => aggregateToDataPoint(assetPropertyValue))
          .filter(isDefined);

        onSuccess([dataStreamFromSiteWise({ assetId, propertyId, dataPoints })]);
      }

      if (nextToken) {
        getAggregatedPropertyDataPointsForProperty({
          assetId,
          propertyId,
          start,
          end,
          resolution,
          aggregateTypes,
          maxResults,
          onSuccess,
          nextToken,
          client,
        });
      }
    });
};

export const getAggregatedPropertyDataPoints = async ({
  client,
  query,
  start,
  end,
  resolution,
  aggregateTypes,
  maxResults,
  onSuccess,
  onError,
}: {
  query: SiteWiseDataStreamQuery;
  start: Date;
  end: Date;
  resolution: string;
  aggregateTypes: AggregateType[];
  maxResults?: number;
  onError: Function;
  onSuccess: DataStreamCallback;
  client: IoTSiteWiseClient;
}) => {
  const requests = query.assets
    .map(({ assetId, propertyIds }) =>
      propertyIds.map((propertyId) =>
        getAggregatedPropertyDataPointsForProperty({
          client,
          assetId,
          propertyId,
          start,
          end,
          resolution,
          aggregateTypes,
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
