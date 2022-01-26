import {
  GetAssetPropertyAggregatesCommand,
  IoTSiteWiseClient,
  TimeOrdering,
  AggregateType,
} from '@aws-sdk/client-iotsitewise';
import { AssetId, AssetPropertyId, SiteWiseDataStreamQuery } from '../types';
import { aggregateToDataPoint } from '../util/toDataPoint';
import { dataStreamFromSiteWise } from '../dataStreamFromSiteWise';
import { DataStreamCallback, ErrorCallback } from '../../../data-module/types';
import { isDefined } from '../../../common/predicates';
import { RESOLUTION_TO_MS_MAPPING } from '../util/resolution';
import { toDataStreamId } from '../util/dataStreamId';

const getAggregatedPropertyDataPointsForProperty = ({
  assetId,
  propertyId,
  start,
  end,
  resolution,
  aggregateTypes,
  maxResults,
  onSuccess,
  onError,
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
  onError: ErrorCallback;
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
        timeOrdering: TimeOrdering.DESCENDING,
        nextToken: prevToken,
      })
    )
    .then(({ aggregatedValues, nextToken }) => {
      if (aggregatedValues) {
        /** Report the page of data to the data-module */
        const dataPoints = aggregatedValues
          .map((assetPropertyValue) => aggregateToDataPoint(assetPropertyValue))
          .filter(isDefined);

        onSuccess([
          dataStreamFromSiteWise({
            assetId,
            propertyId,
            dataPoints,
            resolution: RESOLUTION_TO_MS_MAPPING[resolution],
          }),
        ]);
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
          onError,
          onSuccess,
          nextToken,
          client,
        });
      }
    })
    .catch((err) => {
      const id = toDataStreamId({ assetId, propertyId });
      onError({ id, resolution, error: err.message });
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
  resolution?: string;
  aggregateTypes: AggregateType[];
  maxResults?: number;
  onError: ErrorCallback;
  onSuccess: DataStreamCallback;
  client: IoTSiteWiseClient;
}) => {
  const requests = query.assets
    .map(({ assetId, properties }) =>
      properties.map(({ propertyId, resolution: propertyResolution }) => {
        const resolutionOverride = propertyResolution || resolution;

        if (resolutionOverride == null) {
          throw new Error('Resolution must be either specified in requestConfig or query');
        }

        return getAggregatedPropertyDataPointsForProperty({
          client,
          assetId,
          propertyId,
          start,
          end,
          resolution: resolutionOverride,
          aggregateTypes,
          maxResults,
          onSuccess,
          onError,
        });
      })
    )
    .flat();

  await Promise.all(requests);
};
