import {
  GetAssetPropertyAggregatesCommand,
  IoTSiteWiseClient,
  TimeOrdering,
  AggregateType,
} from '@aws-sdk/client-iotsitewise';
import { AssetId, AssetPropertyId, PropertyAlias } from '../../types';
import { aggregateToDataPoint } from '../../util/toDataPoint';
import { RESOLUTION_TO_MS_MAPPING } from '../../util/resolution';
import { toId, toSiteWiseAssetProperty } from '../../util/dataStreamId';
import { parseDuration, OnSuccessCallback, ErrorCallback, RequestInformationAndRange } from '@iot-app-kit/core';
import { isDefined } from '../../../common/predicates';
import { dataStreamFromSiteWise } from '../../dataStreamFromSiteWise';

const getAggregatedPropertyDataPointsForProperty = ({
  requestInformation,
  aggregateTypes,
  maxResults,
  onSuccess,
  onError,
  nextToken: prevToken,
  client,
  ...propertyInfo
}: {
  requestInformation: RequestInformationAndRange;
  aggregateTypes: AggregateType[];
  maxResults?: number;
  onError: ErrorCallback;
  onSuccess: OnSuccessCallback;
  client: IoTSiteWiseClient;
  nextToken?: string;
} & ({ assetId: AssetId; propertyId: AssetPropertyId } | { propertyAlias: PropertyAlias })) => {
  let { start, end } = requestInformation;
  const { resolution } = requestInformation;

  // fetch leading point without mutating requestInformation
  if (requestInformation.fetchMostRecentBeforeStart) {
    end = start;
    start = new Date(0, 0, 0);
  }

  return client
    .send(
      new GetAssetPropertyAggregatesCommand({
        ...propertyInfo,
        startDate: start,
        endDate: end,
        resolution,
        aggregateTypes,
        maxResults: requestInformation.fetchMostRecentBeforeStart ? 1 : maxResults,
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
              ...propertyInfo,
              dataPoints,
              resolution: RESOLUTION_TO_MS_MAPPING[resolution],
            }),
          ],
          requestInformation,
          start,
          end
        );
      }

      if (nextToken && !requestInformation.fetchMostRecentBeforeStart) {
        getAggregatedPropertyDataPointsForProperty({
          requestInformation,
          ...propertyInfo,
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
      const id = toId(propertyInfo);
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
    .map((requestInformation) => {
      return getAggregatedPropertyDataPointsForProperty({
        ...toSiteWiseAssetProperty(requestInformation.id),
        requestInformation,
        client,
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
