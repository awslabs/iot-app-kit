import {
  BatchGetAssetPropertyValueCommand,
  type IoTSiteWiseClient,
  type BatchGetAssetPropertyValueErrorEntry,
  type BatchGetAssetPropertyValueSuccessEntry,
  type IoTSiteWiseServiceException,
  AccessDeniedException,
  InvalidRequestException,
  ResourceNotFoundException,
} from '@aws-sdk/client-iotsitewise';
import { toDataPoint } from '../util/toDataPoint';
import { dataStreamFromSiteWise } from '../dataStreamFromSiteWise';
import { fromId } from '../util/dataStreamId';
import { isDefined } from '../../common/predicates';
import {
  createRawLatestEntryBatches,
  shouldFetchNextBatch,
  NO_LIMIT_BATCH,
} from './batch';
import { deduplicateBatch } from '../util/deduplication';
import {
  type OnSuccessCallback,
  type ErrorCallback,
  type RequestInformationAndRange,
} from '@iot-app-kit/core';
import type { LatestPropertyParams } from './client';
import { withinLatestPropertyDataThreshold } from './withinLatestPropertyDataThreshold';

export type BatchLatestEntry = {
  requestInformation: RequestInformationAndRange;
  onError: ErrorCallback;
  onSuccess: OnSuccessCallback;
  requestStart: Date;
  requestEnd: Date;
  maxResults?: number;
};

type BatchEntryCallbackCache = {
  [key: string]: {
    onError: (entry: BatchGetAssetPropertyValueErrorEntry) => void;
    onSuccess: (entry: BatchGetAssetPropertyValueSuccessEntry) => void;
  };
};

/**
 *  This API currently does not paginate and nextToken will always be null. However, once
 *  Hybrid Query (hot/cold) is supported it's possible that the API will not return
 *  all entries in a single API request. Supporting nextToken future-proofs this implementation.
 */
const sendRequest = ({
  client,
  batch,
  requestIndex, // used to create and regenerate (for paginating) a unique entryId
  nextToken: prevToken,
}: {
  client: IoTSiteWiseClient;
  batch: BatchLatestEntry[];
  requestIndex: number;
  nextToken?: string;
}) => {
  // callback cache makes it convenient to capture request data in a closure.
  // the cache exposes methods that only require batch response entry as an argument.
  const callbackCache: BatchEntryCallbackCache = {};

  client
    .send(
      new BatchGetAssetPropertyValueCommand({
        entries: deduplicateBatch(batch).map((entry, entryIndex) => {
          const {
            requestInformation,
            onError,
            onSuccess,
            requestStart,
            requestEnd,
          } = entry;
          const { id } = requestInformation;

          // use 2D array indices as entryIDs to guarantee uniqueness
          // entryId is used to map batch entries with the appropriate callback
          const entryId = String(`${requestIndex}-${entryIndex}`);

          // save request entry data in functional closure.
          callbackCache[entryId] = {
            onError: ({
              errorMessage: msg = 'batch latest value error',
              errorCode: status,
            }) => {
              onError({
                id,
                resolution: 0, // currently supports raw data only
                error: { msg, status },
                aggregationType: requestInformation.aggregationType,
              });
            },
            onSuccess: ({ assetPropertyValue }) => {
              if (assetPropertyValue) {
                const dataStream = dataStreamFromSiteWise({
                  ...fromId(id),
                  dataPoints: [toDataPoint(assetPropertyValue)].filter(
                    isDefined
                  ),
                });

                onSuccess(
                  [dataStream],
                  requestInformation,
                  requestStart,
                  requestEnd
                );
              }
            },
          };

          // BatchGetAssetPropertyValueEntry
          return {
            ...fromId(requestInformation.id),
            entryId,
          };
        }),
        nextToken: prevToken,
      })
    )
    .then((response) => {
      const { errorEntries, successEntries, nextToken } = response;

      // execute the correct callback for each entry
      // empty entries and entries that don't exist in the cache are ignored.
      // TODO: implement retries for retry-able batch errors
      errorEntries?.forEach(
        (entry) => entry.entryId && callbackCache[entry.entryId]?.onError(entry)
      );
      successEntries?.forEach(
        (entry) =>
          entry.entryId && callbackCache[entry.entryId]?.onSuccess(entry)
      );

      if (shouldFetchNextBatch({ nextToken, maxResults: NO_LIMIT_BATCH })) {
        sendRequest({
          client,
          batch,
          requestIndex,
          nextToken,
        });
      }
    })
    .catch((e: IoTSiteWiseServiceException) => {
      if (
        e instanceof AccessDeniedException ||
        e instanceof InvalidRequestException ||
        e instanceof ResourceNotFoundException
      ) {
        Object.entries(callbackCache).forEach(([entryId, { onError }]) => {
          onError({
            entryId,
            errorCode: e.name,
            errorMessage: e.message,
          });
        });
      }
    });
};

const batchGetLatestPropertyDataPointsForProperty = ({
  client,
  entries,
}: {
  client: IoTSiteWiseClient;
  entries: BatchLatestEntry[];
}) =>
  createRawLatestEntryBatches<BatchLatestEntry>(entries)
    .filter((batch) => batch.length > 0) // filter out empty batches
    .map(([batch], requestIndex) =>
      sendRequest({ client, batch, requestIndex })
    );

export const batchGetLatestPropertyDataPoints = ({
  params,
  client,
}: {
  params: LatestPropertyParams[];
  client: IoTSiteWiseClient;
}) => {
  const entries: BatchLatestEntry[] = [];

  // fan out params into individual entries, handling fetchMostRecentBeforeStart
  params.forEach(({ requestInformations, onSuccess, onError }) => {
    requestInformations
      .filter(
        ({ end, fetchMostRecentBeforeEnd, resolution }) =>
          resolution === '0' &&
          withinLatestPropertyDataThreshold(end) &&
          fetchMostRecentBeforeEnd
      )
      .forEach((requestInformation) => {
        const { end } = requestInformation;

        entries.push({
          requestInformation,
          onSuccess,
          onError,
          requestStart: new Date(0, 0, 0), // caching will be adjusted based on the returned data point
          requestEnd: end,
        });
      });
  });

  // sort entries to ensure earliest data is fetched first because batch API has a property limit
  entries.sort(
    (a, b) =>
      b.requestInformation.start.getTime() -
      a.requestInformation.start.getTime()
  );

  if (entries.length > 0) {
    batchGetLatestPropertyDataPointsForProperty({
      entries,
      client,
    });
  }
};
