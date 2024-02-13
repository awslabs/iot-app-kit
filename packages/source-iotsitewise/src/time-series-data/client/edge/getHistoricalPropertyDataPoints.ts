import {
  GetAssetPropertyValueHistoryCommand,
  IoTSiteWiseClient,
  TimeOrdering,
} from '@aws-sdk/client-iotsitewise';
import { AssetId, AssetPropertyId } from '../../types';
import { toDataPoint } from '../../util/toDataPoint';
import { dataStreamFromSiteWise } from '../../dataStreamFromSiteWise';
import {
  OnSuccessCallback,
  ErrorCallback,
  RequestInformationAndRange,
  toSiteWiseAssetProperty,
} from '@iot-app-kit/core';
import { toId } from '../../util/dataStreamId';
import { isDefined } from '../../../common/predicates';
import { SITEWISE_PREVIEW_DATE } from '../../util/timeConstants';
import { flattenRequestInfoByFetch } from '../../util/flattenRequestInfoByFetch';

const getHistoricalPropertyDataPointsForProperty = ({
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
  const { fetchMostRecentBeforeStart, fetchMostRecentBeforeEnd } =
    requestInformation;

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
      new GetAssetPropertyValueHistoryCommand({
        assetId,
        propertyId,
        startDate: start,
        endDate: end,
        maxResults,
        timeOrdering: TimeOrdering.DESCENDING,
        nextToken: prevToken,
      })
    )
    .then((response) => {
      if (response) {
        const { assetPropertyValueHistory, nextToken } = response;
        if (assetPropertyValueHistory) {
          /** Report the page of data to the data-module */
          const dataPoints = assetPropertyValueHistory
            .map((assetPropertyValue) => toDataPoint(assetPropertyValue))
            .filter(isDefined);

          onSuccess(
            [dataStreamFromSiteWise({ assetId, propertyId, dataPoints })],
            requestInformation,
            start,
            end
          );
        }

        if (nextToken && !fetchMostRecent) {
          getHistoricalPropertyDataPointsForProperty({
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
      }
    })
    .catch((err) => {
      const id = toId({ assetId, propertyId });
      onError({
        id,
        resolution: 0,
        error: {
          msg: err.message,
          type: err.name,
          status: err.$metadata?.httpStatusCode,
        },
      });
    });
};

export const getHistoricalPropertyDataPoints = async ({
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
    .filter(({ resolution }) => resolution === '0')
    .sort((a, b) => b.start.getTime() - a.start.getTime())
    // fanout on fetchMostRecentBeforeStart, fetchMostRecentBeforeEnd, fetchFromStartToEnd into dedicated request info
    .flatMap(flattenRequestInfoByFetch)
    .map((requestInformation) => {
      const { assetId, propertyId } = toSiteWiseAssetProperty(
        requestInformation.id
      );

      return getHistoricalPropertyDataPointsForProperty({
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
