import {
  GetAssetPropertyAggregatesCommand,
  type IoTSiteWiseClient,
  TimeOrdering,
} from '@aws-sdk/client-iotsitewise';
import { type AssetId, type AssetPropertyId } from '../../types';
import { aggregateToDataPoint } from '../../util/toDataPoint';
import { RESOLUTION_TO_MS_MAPPING } from '../../util/resolution';
import { toId } from '../../util/dataStreamId';
import {
  parseDuration,
  type OnSuccessCallback,
  type ErrorCallback,
  type RequestInformationAndRange,
  toSiteWiseAssetProperty,
} from '@iot-app-kit/core';
import { isDefined } from '../../../common/predicates';
import { dataStreamFromSiteWise } from '../../dataStreamFromSiteWise';
import { SITEWISE_PREVIEW_DATE } from '../../util/timeConstants';
import { flattenRequestInfoByFetch } from '../../util/flattenRequestInfoByFetch';

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

  // only 1 of the following options are enabled at this point:
  // fetchMostRecentBeforeStart, fetchMostRecentBeforeEnd, fetchFromStartToEnd
  const {
    aggregationType,
    fetchMostRecentBeforeStart,
    fetchMostRecentBeforeEnd,
    resolution,
  } = requestInformation;

  if (aggregationType == null) {
    console.error(
      'Failed to call getAggregatedPropertyDataPointsForProperty(...) due to missing `aggregationType` in the requestInformation.'
    );

    return;
  }

  const fetchMostRecent =
    fetchMostRecentBeforeStart || fetchMostRecentBeforeEnd;

  // fetch leading point without mutating requestInformation
  if (fetchMostRecentBeforeStart) {
    end = start;
    // default to year of SiteWise Preview to not workload edge gateway
    start = SITEWISE_PREVIEW_DATE;
    maxResults = 1;
  } else if (fetchMostRecentBeforeEnd) {
    start = SITEWISE_PREVIEW_DATE;
    maxResults = 1;
  }

  return client
    .send(
      new GetAssetPropertyAggregatesCommand({
        assetId,
        propertyId,
        startDate: start,
        endDate: end,
        resolution,
        aggregateTypes: [aggregationType],
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
              aggregationType,
            }),
          ],
          requestInformation,
          start,
          end
        );
      }

      if (nextToken && !fetchMostRecent) {
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
        error: {
          msg: err.message,
          type: err.name,
          status: err.$metadata?.httpStatusCode,
        },
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
    // fanout on fetchMostRecentBeforeStart, fetchMostRecentBeforeEnd, fetchFromStartToEnd into dedicated request info
    .flatMap(flattenRequestInfoByFetch)
    .map((requestInformation) => {
      const { assetId, propertyId } = toSiteWiseAssetProperty(
        requestInformation.id
      );

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
