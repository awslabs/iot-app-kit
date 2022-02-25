import {
  GetAssetPropertyAggregatesCommand,
  IoTSiteWiseClient,
  TimeOrdering,
  AggregateType,
} from '@aws-sdk/client-iotsitewise';
import { AssetId, AssetPropertyId } from '../types';
import { aggregateToDataPoint } from '../util/toDataPoint';
import { RESOLUTION_TO_MS_MAPPING } from '../util/resolution';
import { toId, toSiteWiseAssetProperty } from '../util/dataStreamId';
import { parseDuration, OnSuccessCallback, ErrorCallback, RequestInformationAndRange } from '@iot-app-kit/core';
import { isDefined } from '../../common/predicates';
import { dataStreamFromSiteWise } from '../dataStreamFromSiteWise';

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
  onSuccess: OnSuccessCallback;
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

        onSuccess(
          [
            dataStreamFromSiteWise({
              assetId,
              propertyId,
              dataPoints,
              resolution: RESOLUTION_TO_MS_MAPPING[resolution],
            }),
          ],
          'fetchFromStartToEnd',
          start,
          end
        );
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
      const id = toId({ assetId, propertyId });
      onError({
        id,
        resolution: parseDuration(resolution),
        error: { msg: err.message, type: err.name, status: err.$metadata?.httpStatusCode },
      });
    });
};

export const getAggregatedPropertyDataPoints = async ({
  client,
  requestInformations,
  aggregateTypes,
  maxResults,
  onSuccess,
  onError,
}: {
  requestInformations: RequestInformationAndRange[];
  aggregateTypes: AggregateType[];
  maxResults?: number;
  onError: ErrorCallback;
  onSuccess: OnSuccessCallback;
  client: IoTSiteWiseClient;
}) => {
  const requests = requestInformations
    .filter(({ resolution }) => resolution !== '0')
    .sort((a, b) => b.start.getTime() - a.start.getTime())
    .map(({ id, start, end, resolution }) => {
      const { assetId, propertyId } = toSiteWiseAssetProperty(id);

      return getAggregatedPropertyDataPointsForProperty({
        client,
        assetId,
        propertyId,
        start,
        end,
        resolution,
        aggregateTypes,
        maxResults,
        onSuccess,
        onError,
      });
    });

  try {
    await Promise.all(requests);
  } catch (err) {
    // NOOP
  }
};
