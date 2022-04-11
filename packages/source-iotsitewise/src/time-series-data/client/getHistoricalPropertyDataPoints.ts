import { GetAssetPropertyValueHistoryCommand, IoTSiteWiseClient, TimeOrdering } from '@aws-sdk/client-iotsitewise';
import { AssetId, AssetPropertyId } from '../types';
import { toDataPoint } from '../util/toDataPoint';
import { dataStreamFromSiteWise } from '../dataStreamFromSiteWise';
import { OnSuccessCallback, ErrorCallback, RequestInformationAndRange } from '@iot-app-kit/core';
import { toId, toSiteWiseAssetProperty } from '../util/dataStreamId';
import { isDefined } from '../../common/predicates';

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

  // fetch leading point without mutating requestInformation
  if (requestInformation.fetchMostRecentBeforeStart) {
    end = start;
    start = new Date(0, 0, 0);
  }

  return client
    .send(
      new GetAssetPropertyValueHistoryCommand({
        assetId,
        propertyId,
        startDate: start,
        endDate: end,
        maxResults: requestInformation.fetchMostRecentBeforeStart ? 1 : maxResults,
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

          onSuccess([dataStreamFromSiteWise({ assetId, propertyId, dataPoints })], requestInformation, start, end);
        }

        if (nextToken && !requestInformation.fetchMostRecentBeforeStart) {
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
        error: { msg: err.message, type: err.name, status: err.$metadata?.httpStatusCode },
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
    .map((requestInformation) => {
      const { assetId, propertyId } = toSiteWiseAssetProperty(requestInformation.id);

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
