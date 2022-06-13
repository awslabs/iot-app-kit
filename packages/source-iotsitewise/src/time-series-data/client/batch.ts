// current maximum batch size when using batch APIs
export const MAX_BATCH_RESULTS = 4000;

// current batch API entry limit
export const MAX_BATCH_ENTRIES = 16;

// use -1 to represent a batch with no max result limit
export const NO_LIMIT_BATCH = -1;

/**
 * bucket entries by maxResults, chunk buckets if required.
 * entries[] => [[entries, -1], [entries, 1000], [entries, 16]]
 *
 * @param entries
 * @returns buckets: [BatchHistoricalEntry[], number | undefined][]
 */
export const createEntryBatches = <T extends { maxResults?: number }>(entries: T[]): [T[], number][] => {
  const buckets: { [key: number]: T[] } = {};

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

      return chunkBatch(bucket).map((chunk): [T[], number] => [
        chunk,
        maxEntryResults === NO_LIMIT_BATCH ? NO_LIMIT_BATCH : chunk.length * maxEntryResults,
      ]);
    })
    .flat();
};

/**
 * calculate the required size of the next batch
 */
export const calculateNextBatchSize = ({
  maxResults,
  dataPointsFetched,
}: {
  maxResults: number;
  dataPointsFetched: number;
}) => (maxResults === NO_LIMIT_BATCH ? MAX_BATCH_RESULTS : Math.min(maxResults - dataPointsFetched, MAX_BATCH_RESULTS));

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
    (dataPointsFetched !== null && dataPointsFetched !== undefined && dataPointsFetched < maxResults));

/**
 * chunk batches by MAX_BATCH_ENTRIES
 */
const chunkBatch = <T>(batch: T[]): T[][] => {
  const chunks = [];

  for (let i = 0; i < batch.length; i += MAX_BATCH_ENTRIES) {
    chunks.push(batch.slice(i, i + MAX_BATCH_ENTRIES));
  }

  return chunks;
};
