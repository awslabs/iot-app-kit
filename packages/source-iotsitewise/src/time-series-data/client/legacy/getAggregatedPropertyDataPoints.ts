import {
  GetAssetPropertyAggregatesCommand,
  IoTSiteWiseClient,
  TimeOrdering,
  AggregateType,
} from '@aws-sdk/client-iotsitewise';
import { AssetId, AssetPropertyId } from '../../types';
import { aggregateToDataPoint } from '../../util/toDataPoint';
import { RESOLUTION_TO_MS_MAPPING } from '../../util/resolution';
import { toId } from '../../util/dataStreamId';
import { parseDuration, OnSuccessCallback, ErrorCallback, RequestInformationAndRange, toSiteWiseAssetProperty } from '@iot-app-kit/core';
import { isDefined } from '../../../common/predicates';
import { dataStreamFromSiteWise } from '../../dataStreamFromSiteWise';

const getAggregatedPropertyDataPointsForProperty = ({
  requestInformation,
  assetId,
  propertyId,
  maxResults,
  onSuccess,
  onError,
  nextToken: prevToken,
  client,
}: {
  requestInformation: RequestInformationAndRange;
  assetId: AssetId;
  propertyId: AssetPropertyId;
  maxResults?: number;
  onError: ErrorCallback;
  onSuccess: OnSuccessCallback;
  client: IoTSiteWiseClient;
  nextToken?: string;
}) => {
  let { start, end } = requestInformation;
  const { resolution } = requestInformation;

  // fetch leading point without mutating requestInformation
  if (requestInformation.fetchMostRecentBeforeStart) {
    end = start;
    start = new Date(2018, 0, 1);
  }

  return client
    .send(
      new GetAssetPropertyAggregatesCommand({
        assetId,
        propertyId,
        startDate: start,
        endDate: end,
        resolution,
        aggregateTypes: [
          requestInformation.aggregationType as AggregateType,
        ],
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
              assetId,
              propertyId,
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
          assetId,
          propertyId,
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
  maxResults,
  onSuccess,
  onError,
}: {
  requestInformations: RequestInformationAndRange[];
  maxResults?: number;
  onError: ErrorCallback;
  onSuccess: OnSuccessCallback;
  client: IoTSiteWiseClient;
}) => {
  const requests = requestInformations
    .filter(({ resolution }) => resolution !== '0')
    .sort((a, b) => b.start.getTime() - a.start.getTime())
    .map((requestInformation) => {
      const { assetId, propertyId } = toSiteWiseAssetProperty(requestInformation.id);

      return getAggregatedPropertyDataPointsForProperty({
        requestInformation,
        client,
        assetId,
        propertyId,
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
