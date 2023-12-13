import {
  AggregateType,
  BatchGetAssetPropertyAggregatesCommand,
  IoTSiteWiseClient,
  TimeOrdering,
} from '@aws-sdk/client-iotsitewise';
import { aggregateToDataPoint } from '../util/toDataPoint';
import { dataStreamFromSiteWise } from '../dataStreamFromSiteWise';
import { parseDuration } from '@iot-app-kit/core';
import { fromId } from '../util/dataStreamId';
import { isDefined } from '../../common/predicates';
import { createEntryBatches, shouldFetchNextBatch } from './batch';
import { RESOLUTION_TO_MS_MAPPING } from '../util/resolution';
import { deduplicateBatch } from '../util/deduplication';
import type {
  BatchGetAssetPropertyAggregatesErrorEntry,
  BatchGetAssetPropertyAggregatesSuccessEntry,
} from '@aws-sdk/client-iotsitewise';
import type { OnSuccessCallback, ErrorCallback, RequestInformationAndRange } from '@iot-app-kit/core';
import type { AggregatedPropertyParams } from './client';

export type BatchAggregatedEntry = {
  requestInformation: RequestInformationAndRange;
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

const BATCH_SIZE = 16;
const ENTRY_SIZE = 4_000;

const sendRequest = ({
  client,
  batch,
  maxResults,
  requestIndex, // used to create and regenerate (for paginating) a unique entryId
  nextToken: prevToken,
}: {
  client: IoTSiteWiseClient;
  batch: BatchAggregatedEntry[];
  maxResults: number;
  requestIndex: number;
  nextToken?: string;
}) => {
  // callback cache makes it convenient to capture request data in a closure.
  // the cache exposes methods that only require batch response entry as an argument.
  const callbackCache: BatchEntryCallbackCache = {};

  client
    .send(
      new BatchGetAssetPropertyAggregatesCommand({
        entries: deduplicateBatch(batch).map((entry, entryIndex) => {
          const { requestInformation, onError, onSuccess, requestStart, requestEnd } = entry;
          const { id, resolution, aggregationType } = requestInformation;

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
                aggregationType: aggregationType,
              });
            },
            onSuccess: ({ aggregatedValues }) => {
              if (aggregatedValues) {
                onSuccess(
                  [
                    dataStreamFromSiteWise({
                      ...fromId(id),
                      dataPoints: aggregatedValues
                        .map((aggregatedValue) => aggregateToDataPoint(aggregatedValue))
                        .filter(isDefined),
                      resolution: RESOLUTION_TO_MS_MAPPING[resolution],
                      aggregationType: aggregationType,
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
            ...fromId(requestInformation.id),
            aggregateTypes: [requestInformation.aggregationType as AggregateType],
            resolution,
            startDate: requestStart,
            endDate: requestEnd,
            entryId,
            timeOrdering: TimeOrdering.DESCENDING,
          };
        }),
        maxResults,
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

      if (shouldFetchNextBatch({ nextToken })) {
        sendRequest({
          client,
          batch,
          maxResults,
          requestIndex,
          nextToken,
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
  createEntryBatches<BatchAggregatedEntry>(entries, BATCH_SIZE)
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
  params.forEach(({ requestInformations, onSuccess, onError }) => {
    requestInformations
      .filter(({ resolution }) => resolution !== '0')
      .forEach((requestInformation) => {
        const { fetchMostRecentBeforeStart, start, end } = requestInformation;

        entries.push({
          requestInformation,
          maxResults: fetchMostRecentBeforeStart ? 1 : ENTRY_SIZE,
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
