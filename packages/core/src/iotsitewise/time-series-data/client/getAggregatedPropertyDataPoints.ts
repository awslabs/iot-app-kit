import {
  GetAssetPropertyAggregatesCommand,
  IoTSiteWiseClient,
  TimeOrdering,
  AggregateType,
} from '@aws-sdk/client-iotsitewise';
import { AssetId, AssetPropertyId, SiteWiseDataStreamQuery } from '../types';
import { aggregateToDataPoint } from '../util/toDataPoint';
import { dataStreamFromSiteWise } from '../dataStreamFromSiteWise';
import { DataStreamCallback, ErrorCallback, RequestInformationAndRange } from '../../../data-module/types';
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
  requestInformations,
  resolution,
  aggregateTypes,
  maxResults,
  onSuccess,
  onError,
}: {
  query: SiteWiseDataStreamQuery;
  requestInformations: RequestInformationAndRange[];
  resolution: string;
  aggregateTypes: AggregateType[];
  maxResults?: number;
  onError: ErrorCallback;
  onSuccess: DataStreamCallback;
  client: IoTSiteWiseClient;
}) => {
  const dataStreamQueries = query.assets
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

      const resolutionOverride = dataStreamsToRequest?.resolution || resolution;

      if (resolutionOverride == null) {
        throw new Error('Resolution must be either specified in requestConfig or query');
      }

      if (dataStreamsToRequest) {
        return getAggregatedPropertyDataPointsForProperty({
          client,
          assetId: dataStreamsToRequest.assetId,
          propertyId: dataStreamsToRequest.propertyId,
          start,
          end,
          resolution: resolutionOverride,
          aggregateTypes,
          maxResults,
          onSuccess,
          onError,
        });
      }
    });

  try {
    await Promise.all(requests);
  } catch (err) {
    // NOOP
  }
};
