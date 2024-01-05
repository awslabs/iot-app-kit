import { BatchGetAssetPropertyValueHistoryCommand, IoTSiteWiseClient, TimeOrdering } from '@aws-sdk/client-iotsitewise';
import { toDataPoint } from '../util/toDataPoint';
import { dataStreamFromSiteWise } from '../dataStreamFromSiteWise';
import { fromId } from '../util/dataStreamId';
import { isDefined } from '../../common/predicates';
import { createEntryBatches, calculateNextBatchSize, shouldFetchNextBatch } from './batch';
import { deduplicateBatch } from '../util/deduplication';
import { RESOLUTION_TO_MS_MAPPING } from '../util/resolution';
import type {
  BatchGetAssetPropertyValueHistoryErrorEntry,
  BatchGetAssetPropertyValueHistorySuccessEntry,
} from '@aws-sdk/client-iotsitewise';
import { type OnSuccessCallback, type ErrorCallback, type RequestInformationAndRange } from '@iot-app-kit/core';
import type { HistoricalPropertyParams } from './client';
import { withinLatestPropertyDataThreshold } from './withinLatestPropertyDataThreshold';

export type BatchHistoricalEntry = {
  requestInformation: RequestInformationAndRange;
  maxResults?: number;
  onError: ErrorCallback;
  onSuccess: OnSuccessCallback;
  requestStart: Date;
  requestEnd: Date;
};

type BatchEntryCallbackCache = {
  [key: string]: {
    onError: (entry: BatchGetAssetPropertyValueHistoryErrorEntry) => void;
    onSuccess: (entry: BatchGetAssetPropertyValueHistorySuccessEntry) => void;
  };
};

const sendRequest = ({
  client,
  batch,
  maxResults,
  requestIndex, // used to create and regenerate (for paginating) a unique entryId
  nextToken: prevToken,
  dataPointsFetched = 0, // track number of data points fetched so far
}: {
  client: IoTSiteWiseClient;
  batch: BatchHistoricalEntry[];
  maxResults: number;
  requestIndex: number;
  nextToken?: string;
  dataPointsFetched?: number;
}) => {
  // callback cache makes it convenient to capture request data in a closure.
  // the cache exposes methods that only require batch response entry as an argument.
  const callbackCache: BatchEntryCallbackCache = {};

  const batchSize = calculateNextBatchSize({ maxResults, dataPointsFetched });

  client
    .send(
      new BatchGetAssetPropertyValueHistoryCommand({
        entries: deduplicateBatch(batch).map((entry, entryIndex) => {
          const { requestInformation, onError, onSuccess, requestStart, requestEnd } = entry;
          const { id, resolution, aggregationType } = requestInformation;

          // use 2D array indices as entryIDs to guarantee uniqueness
          // entryId is used to map batch entries with the appropriate callback
          const entryId = String(`${requestIndex}-${entryIndex}`);

          // save request entry data in functional closure.
          callbackCache[entryId] = {
            onError: ({ errorMessage: msg = 'batch historical error', errorCode: status }) => {
              onError({
                id,
                resolution: 0,
                error: { msg, status },
                aggregationType: requestInformation.aggregationType,
              });
            },
            onSuccess: ({ assetPropertyValueHistory }) => {
              if (assetPropertyValueHistory) {
                onSuccess(
                  [
                    dataStreamFromSiteWise({
                      ...fromId(id),
                      aggregationType,
                      resolution: RESOLUTION_TO_MS_MAPPING[resolution],
                      dataPoints: assetPropertyValueHistory
                        .map((assetPropertyValue) => toDataPoint(assetPropertyValue))
                        .filter(isDefined),
                    }),
                  ],
                  requestInformation,
                  requestStart,
                  requestEnd
                );
              }
            },
          };

          // BatchGetAssetPropertyValueHistoryEntry
          return {
            ...fromId(requestInformation.id),
            startDate: requestStart,
            endDate: requestEnd,
            entryId,
            timeOrdering: TimeOrdering.DESCENDING,
          };
        }),
        maxResults: batchSize,
        nextToken: prevToken,
      })
    )
    .then((response) => {
      const { errorEntries, successEntries, nextToken } = response;

      // execute the correct callback for each entry
      // empty entries and entries that don't exist in the cache are ignored.
      // TODO: implement retries for retry-able batch errors
      errorEntries?.forEach((entry) => entry.entryId && callbackCache[entry.entryId]?.onError(entry));
      successEntries?.forEach((entry) => entry.entryId && callbackCache[entry.entryId]?.onSuccess(entry));

      // increment number of data points fetched
      dataPointsFetched += batchSize;

      if (shouldFetchNextBatch({ nextToken, maxResults, dataPointsFetched })) {
        sendRequest({
          client,
          batch,
          maxResults,
          requestIndex,
          nextToken,
          dataPointsFetched,
        });
      }
    });
};

const batchGetHistoricalPropertyDataPointsForProperty = ({
  client,
  entries,
}: {
  client: IoTSiteWiseClient;
  entries: BatchHistoricalEntry[];
}) =>
  createEntryBatches<BatchHistoricalEntry>(entries)
    .filter((batch) => batch.length > 0) // filter out empty batches
    .map(([batch, maxResults], requestIndex) => sendRequest({ client, batch, maxResults, requestIndex }));

const shouldAcceptRequest = ({
  end,
  fetchFromStartToEnd,
  fetchMostRecentBeforeStart,
  fetchMostRecentBeforeEnd,
  resolution,
}: RequestInformationAndRange) => {
  return (
    resolution === '0' &&
    ((!withinLatestPropertyDataThreshold(end) && fetchMostRecentBeforeEnd) ||
      fetchFromStartToEnd ||
      fetchMostRecentBeforeStart)
  );
};

export const batchGetHistoricalPropertyDataPoints = ({
  params,
  client,
}: {
  params: HistoricalPropertyParams[];
  client: IoTSiteWiseClient;
}) => {
  const entries: BatchHistoricalEntry[] = [];

  // fan out params into individual entries, handling fetchMostRecentBeforeStart
  params.forEach(({ requestInformations, maxResults, onSuccess, onError }) => {
    requestInformations.filter(shouldAcceptRequest).forEach((requestInformation) => {
      const { fetchMostRecentBeforeStart, fetchMostRecentBeforeEnd, start, end } = requestInformation;

      const isMostRecent = fetchMostRecentBeforeStart || fetchMostRecentBeforeEnd;

      entries.push({
        requestInformation,
        maxResults: isMostRecent ? 1 : maxResults,
        onSuccess,
        onError,
        requestStart: isMostRecent ? new Date(0, 0, 0) : start,
        requestEnd: fetchMostRecentBeforeStart ? start : end,
      });
    });
  });

  // sort entries to ensure earliest data is fetched first because batch API has a property limit
  entries.sort((a, b) => b.requestInformation.start.getTime() - a.requestInformation.start.getTime());

  if (entries.length > 0) {
    batchGetHistoricalPropertyDataPointsForProperty({
      entries,
      client,
    });
  }
};
