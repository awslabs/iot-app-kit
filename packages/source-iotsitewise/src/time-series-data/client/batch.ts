// current maximum batch size when using batch APIs
// export const MAX_BATCH_RESULTS = 4000;

// current batch API entry limit
// export const MAX_BATCH_ENTRIES = 16;

// use -1 to represent a batch with no max result limit
export const NO_LIMIT_BATCH = -1;

/**
 * bucket entries by maxResults, chunk buckets if required.
 * entries[] => [[entries, -1], [entries, 1000], [entries, 16]]
 *
 * @param entries
 * @returns buckets: [BatchHistoricalEntry[], number | undefined][]
 */
export const createEntryBatches = <T extends { maxResults?: number }>(
  entries: T[],
  batchSize: number
): [T[], number][] => {
  const buckets: { [key: number]: T[] } = {};

  entries.forEach((entry) => {
    const maxEntryResults = entry.maxResults || NO_LIMIT_BATCH;

    if (buckets[maxEntryResults]) {
      buckets[maxEntryResults] = buckets[maxEntryResults].concat([entry]);
    } else {
      buckets[maxEntryResults] = [entry];
    }
  });

  return Object.keys(buckets)
    .map((key) => {
      const maxEntryResults = Number(key);
      const bucket = buckets[maxEntryResults];

      return chunkBatch(bucket, batchSize).map((chunk): [T[], number] => [chunk, maxEntryResults]);
    })
    .flat();
};

/**
 * check if batch still needs to be paginated.
 */
export const shouldFetchNextBatch = ({ nextToken }: { nextToken: string | undefined }) => !!nextToken;

/**
 * chunk batches by MAX_BATCH_ENTRIES
 */
const chunkBatch = <T>(batch: T[], batchSize: number): T[][] => {
  const chunks = [];

  for (let i = 0; i < batch.length; i += batchSize) {
    chunks.push(batch.slice(i, i + batchSize));
  }

  return chunks;
};
