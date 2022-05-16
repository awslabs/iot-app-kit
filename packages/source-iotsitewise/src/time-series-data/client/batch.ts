// current maximum value for maxResults when using batch APIs
const MAX_BATCH_RESULTS = 4000;

/**
 * bucket entries by maxResults
 * entries[] => [[entries, 4000], [entries, 1000], [entries, 100]]
 *
 * @param entries
 * @returns buckets: [BatchHistoricalEntry[], number | undefined][]
 */
export const createEntryBatches = <T extends { maxResults?: number }>(entries: T[]): [T[], number][] => {
  const buckets: { [key: number]: T[] } = {};

  entries.forEach((entry) => {
    const key = entry.maxResults || MAX_BATCH_RESULTS;

    if (buckets[key]) {
      buckets[key] = buckets[key].concat([entry]);
    } else {
      buckets[key] = [entry];
    }
  });

  return Object.keys(buckets).map((key) => [buckets[Number(key)], Number(key)]);
};
