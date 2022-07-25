import {
  AggregateType,
  BatchGetAssetPropertyAggregatesCommand,
  BatchGetAssetPropertyAggregatesErrorEntry,
  BatchGetAssetPropertyAggregatesSuccessEntry,
  IoTSiteWiseClient,
  TimeOrdering,
} from '@aws-sdk/client-iotsitewise';
import { aggregateToDataPoint } from '../util/toDataPoint';
import { dataStreamFromSiteWise } from '../dataStreamFromSiteWise';
import { OnSuccessCallback, ErrorCallback, RequestInformationAndRange, parseDuration } from '@iot-app-kit/core';
import { toSiteWiseAssetProperty } from '../util/dataStreamId';
import { isDefined } from '../../common/predicates';
import { AggregatedPropertyParams } from './client';
import { createEntryBatches, calculateNextBatchSize, shouldFetchNextBatch } from './batch';
import { RESOLUTION_TO_MS_MAPPING } from '../util/resolution';

type BatchAggregatedEntry = {
  requestInformation: RequestInformationAndRange;
  aggregateTypes: AggregateType[];
  maxResults?: number;
  onError: ErrorCallback;
  onSuccess: OnSuccessCallback;
  requestStart: Date;
  requestEnd: Date;
};

type BatchEntryCallbackCache = {
  [key: string]: {
    onError: (entry: BatchGetAssetPropertyAggregatesErrorEntry) => void;
    onSuccess: (entry: BatchGetAssetPropertyAggregatesSuccessEntry) => void;
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
  batch: BatchAggregatedEntry[];
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
      new BatchGetAssetPropertyAggregatesCommand({
        entries: batch.map((entry, entryIndex) => {
          const { requestInformation, aggregateTypes, onError, onSuccess, requestStart, requestEnd } = entry;
          const { id, resolution } = requestInformation;

          // use 2D array indices as entryIDs to guarantee uniqueness
          // entryId is used to map batch entries with the appropriate callback
          const entryId = String(`${requestIndex}-${entryIndex}`);

          // save request entry data in functional closure.
          callbackCache[entryId] = {
            onError: ({ errorMessage: msg = 'batch aggregate error', errorCode: status }) => {
              onError({
                id,
                resolution: parseDuration(resolution),
                error: { msg, status },
              });
            },
            onSuccess: ({ aggregatedValues }) => {
              if (aggregatedValues) {
                onSuccess(
                  [
                    dataStreamFromSiteWise({
                      ...toSiteWiseAssetProperty(id),
                      dataPoints: aggregatedValues
                        .map((aggregatedValue) => aggregateToDataPoint(aggregatedValue))
                        .filter(isDefined),
                      resolution: RESOLUTION_TO_MS_MAPPING[resolution],
                    }),
                  ],
                  requestInformation,
                  requestStart,
                  requestEnd
                );
              }
            },
          };

          // BatchGetAssetPropertyValueAggregatesEntry
          return {
            ...toSiteWiseAssetProperty(requestInformation.id),
            aggregateTypes,
            resolution,
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

const batchGetAggregatedPropertyDataPointsForProperty = ({
  client,
  entries,
}: {
  client: IoTSiteWiseClient;
  entries: BatchAggregatedEntry[];
}) =>
  createEntryBatches<BatchAggregatedEntry>(entries)
    .filter((batch) => batch.length > 0) // filter out empty batches
    .map(([batch, maxResults], requestIndex) => sendRequest({ client, batch, maxResults, requestIndex }));

export const batchGetAggregatedPropertyDataPoints = ({
  params,
  client,
}: {
  params: AggregatedPropertyParams[];
  client: IoTSiteWiseClient;
}) => {
  const entries: BatchAggregatedEntry[] = [];

  // fan out params into individual entries, handling fetchMostRecentBeforeStart
  params.forEach(({ requestInformations, maxResults, onSuccess, onError, aggregateTypes }) => {
    requestInformations
      .filter(({ resolution }) => resolution !== '0')
      .forEach((requestInformation) => {
        const { fetchMostRecentBeforeStart, start, end } = requestInformation;

        entries.push({
          requestInformation,
          aggregateTypes,
          maxResults: fetchMostRecentBeforeStart ? 1 : maxResults,
          onSuccess,
          onError,
          requestStart: fetchMostRecentBeforeStart ? new Date(0, 0, 0) : start,
          requestEnd: fetchMostRecentBeforeStart ? start : end,
        });
      });
  });

  // sort entries to ensure earliest data is fetched first because batch API has a property limit
  entries.sort((a, b) => b.requestInformation.start.getTime() - a.requestInformation.start.getTime());

  if (entries.length > 0) {
    batchGetAggregatedPropertyDataPointsForProperty({
      entries,
      client,
    });
  }
};
