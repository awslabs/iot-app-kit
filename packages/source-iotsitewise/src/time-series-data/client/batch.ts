import type { RequestInformation } from '@iot-app-kit/core';
import {
  MAX_AGGREGATED_DATA_POINTS,
  MAX_AGGREGATED_REQUEST_ENTRIES,
  MAX_RAW_HISTORICAL_DATA_POINTS,
  MAX_RAW_HISTORICAL_REQUEST_ENTRIES,
  MAX_RAW_LATEST_REQUEST_ENTRIES,
} from './constants';

// use -1 to represent a batch with no max result limit
export const NO_LIMIT_BATCH = -1;

/**
 * bucket entries by maxResults, chunk buckets if required.
 * entries[] => [[entries, -1], [entries, 1000], [entries, 16]]
 *
 * @param entries
 * @returns buckets: [BatchHistoricalEntry[], number | undefined][]
 */
export function createRawLatestEntryBatches<T extends { maxResults?: number }>(
  entries: T[]
): [T[], number][] {
  const buckets: Record<number, T[]> = {};

  entries.forEach((entry) => {
    const maxEntryResults = entry.maxResults || NO_LIMIT_BATCH;

    if (buckets[maxEntryResults]) {
      buckets[maxEntryResults] = buckets[maxEntryResults].concat([entry]);
    } else {
      buckets[maxEntryResults] = [entry];
    }
  });

  // chunk buckets that are larger than MAX_BATCH_ENTRIES
  return Object.keys(buckets)
    .map((key) => {
      const maxEntryResults = Number(key);
      const bucket = buckets[maxEntryResults];

      return chunkRawLatestBatch(bucket).map((chunk): [T[], number] => [
        chunk,
        maxEntryResults === NO_LIMIT_BATCH
          ? NO_LIMIT_BATCH
          : chunk.length * maxEntryResults,
      ]);
    })
    .flat();
}

export function createRawHistoricalEntryBatches<
  T extends { requestInformation?: RequestInformation; maxResults?: number }
>(entries: T[]): [T[], number][] {
  const buckets: Record<number, T[]> = {};
  /*
   * singles contains the entries that should not be combined.
   * For example, most-recent-request entries are not combined to ensure a
   * dedicated request with maxResults of 1 is fired for each entry.
   */
  const singles: [T[], number][] = [];

  entries.forEach((entry) => {
    // Do NOT combine most recent requests
    if (isMostRecentRequest(entry)) {
      singles.push([[entry], 1]);

      return;
    }

    const maxEntryResults = entry.maxResults || NO_LIMIT_BATCH;

    if (buckets[maxEntryResults]) {
      buckets[maxEntryResults] = buckets[maxEntryResults].concat([entry]);
    } else {
      buckets[maxEntryResults] = [entry];
    }
  });

  // chunk buckets that are larger than MAX_BATCH_ENTRIES
  return Object.keys(buckets)
    .map((key) => {
      const maxEntryResults = Number(key);
      const bucket = buckets[maxEntryResults];

      return chunkRawHistoricalBatch(bucket).map((chunk): [T[], number] => [
        chunk,
        maxEntryResults === NO_LIMIT_BATCH
          ? NO_LIMIT_BATCH
          : chunk.length * maxEntryResults,
      ]);
    })
    .flat()
    .concat(singles);
}

export function createAggregateEntryBatches<
  T extends { requestInformation?: RequestInformation; maxResults?: number }
>(entries: T[]): [T[], number][] {
  const buckets: Record<number, T[]> = {};
  /*
   * singles contains the entries that should not be combined.
   * For example, most-recent-request entries are not combined to ensure a
   * dedicated request with maxResults of 1 is fired for each entry.
   */
  const singles: [T[], number][] = [];

  entries.forEach((entry) => {
    // Do NOT combine most recent requests
    if (isMostRecentRequest(entry)) {
      singles.push([[entry], 1]);

      return;
    }

    const maxEntryResults = entry.maxResults || NO_LIMIT_BATCH;

    if (buckets[maxEntryResults]) {
      buckets[maxEntryResults] = buckets[maxEntryResults].concat([entry]);
    } else {
      buckets[maxEntryResults] = [entry];
    }
  });

  // chunk buckets that are larger than MAX_BATCH_ENTRIES
  return Object.keys(buckets)
    .map((key) => {
      const maxEntryResults = Number(key);
      const bucket = buckets[maxEntryResults];

      return chunkAggregatedBatch(bucket).map((chunk): [T[], number] => [
        chunk,
        maxEntryResults === NO_LIMIT_BATCH
          ? NO_LIMIT_BATCH
          : chunk.length * maxEntryResults,
      ]);
    })
    .flat()
    .concat(singles);
}

export function calculateNextRawHistoricalBatchSize({
  maxResults,
  dataPointsFetched,
}: {
  maxResults: number;
  dataPointsFetched: number;
}) {
  return maxResults === NO_LIMIT_BATCH
    ? MAX_RAW_HISTORICAL_DATA_POINTS
    : Math.min(maxResults - dataPointsFetched, MAX_RAW_HISTORICAL_DATA_POINTS);
}

export function calculateNextAggregatedBatchSize({
  maxResults,
  dataPointsFetched,
}: {
  maxResults: number;
  dataPointsFetched: number;
}) {
  return maxResults === NO_LIMIT_BATCH
    ? MAX_AGGREGATED_DATA_POINTS
    : Math.min(maxResults - dataPointsFetched, MAX_AGGREGATED_DATA_POINTS);
}

/**
 * check if batch still needs to be paginated.
 */
export const shouldFetchNextBatch = ({
  nextToken,
  maxResults,
  dataPointsFetched,
}: {
  nextToken: string | undefined;
  maxResults: number;
  dataPointsFetched?: number;
}) =>
  !!nextToken &&
  (maxResults === NO_LIMIT_BATCH ||
    (dataPointsFetched !== null &&
      dataPointsFetched !== undefined &&
      dataPointsFetched < maxResults));

function chunkRawLatestBatch<T>(batch: T[]): T[][] {
  const chunks = [];

  for (let i = 0; i < batch.length; i += MAX_RAW_LATEST_REQUEST_ENTRIES) {
    chunks.push(batch.slice(i, i + MAX_RAW_LATEST_REQUEST_ENTRIES));
  }

  return chunks;
}

function chunkRawHistoricalBatch<T>(batch: T[]): T[][] {
  const chunks = [];

  for (let i = 0; i < batch.length; i += MAX_RAW_HISTORICAL_REQUEST_ENTRIES) {
    chunks.push(batch.slice(i, i + MAX_RAW_HISTORICAL_REQUEST_ENTRIES));
  }

  return chunks;
}

function chunkAggregatedBatch<T>(batch: T[]): T[][] {
  const chunks = [];

  for (let i = 0; i < batch.length; i += MAX_AGGREGATED_REQUEST_ENTRIES) {
    chunks.push(batch.slice(i, i + MAX_AGGREGATED_REQUEST_ENTRIES));
  }

  return chunks;
}

function isMostRecentRequest<
  T extends { requestInformation?: RequestInformation }
>({ requestInformation }: T) {
  if (requestInformation == null) {
    return false;
  }

  const { fetchMostRecentBeforeEnd, fetchMostRecentBeforeStart } =
    requestInformation;

  return fetchMostRecentBeforeEnd || fetchMostRecentBeforeStart || false;
}
