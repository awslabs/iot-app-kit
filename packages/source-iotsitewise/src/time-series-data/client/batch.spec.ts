import {
  createEntryBatches,
  calculateNextBatchSize,
  shouldFetchNextBatch,
  MAX_BATCH_RESULTS,
  MAX_BATCH_ENTRIES,
  NO_LIMIT_BATCH,
} from './batch';

describe('createEntryBatches', () => {
  it('buckets entries by maxResults for a given batch', () => {
    const batches = createEntryBatches([
      {
        id: '1',
        maxResults: undefined,
      },
      {
        id: '2',
        maxResults: 2000,
      },
      {
        id: '3',
        maxResults: 2000,
      },
      {
        id: '4',
        maxResults: 10,
      },
      {
        id: '5',
        maxResults: 2000,
      },
    ]);

    expect(batches).toEqual(
      expect.arrayContaining([
        [
          [
            {
              id: '1',
              maxResults: undefined,
            },
          ],
          NO_LIMIT_BATCH,
        ],
        [
          [
            {
              id: '2',
              maxResults: 2000,
            },
            {
              id: '3',
              maxResults: 2000,
            },
            {
              id: '5',
              maxResults: 2000,
            },
          ],
          6000,
        ],
        [
          [
            {
              id: '4',
              maxResults: 10,
            },
          ],
          10,
        ],
      ])
    );
  });

  it('chunks batches that exceed max entry size (16)', () => {
    const entrySize = 2000;

    const entries = [
      ...[...Array(MAX_BATCH_ENTRIES * 3)].map((args, index) => ({
        id: String(index),
        maxResults: entrySize,
      })),
      {
        id: 'abc',
        maxResults: 10,
      },
    ];

    const batches = createEntryBatches(entries);

    expect(batches).toEqual(
      expect.arrayContaining([
        [entries.slice(0, MAX_BATCH_ENTRIES), MAX_BATCH_ENTRIES * entrySize],
        [entries.slice(MAX_BATCH_ENTRIES, 2 * MAX_BATCH_ENTRIES), MAX_BATCH_ENTRIES * entrySize],
        [entries.slice(MAX_BATCH_ENTRIES * 2, MAX_BATCH_ENTRIES * 3), MAX_BATCH_ENTRIES * entrySize],
        [[entries[MAX_BATCH_ENTRIES * 3]], 10],
      ])
    );
  });

  it('handles empty input', () => {
    const batches = createEntryBatches([]);
    expect(batches).toEqual([]);
  });
});

describe('calculateNextBatchSize', () => {
  it('returns the correct max batch size for no limit batches', () => {
    expect(calculateNextBatchSize({ maxResults: NO_LIMIT_BATCH, dataPointsFetched: 0 })).toBe(MAX_BATCH_RESULTS);
    expect(calculateNextBatchSize({ maxResults: NO_LIMIT_BATCH, dataPointsFetched: 100000 })).toBe(MAX_BATCH_RESULTS);
  });

  it('returns the correct max batch size when specified and need to fetch more than MAX_BATCH_SIZE', () => {
    expect(calculateNextBatchSize({ maxResults: MAX_BATCH_RESULTS * 3, dataPointsFetched: 0 })).toBe(MAX_BATCH_RESULTS);
  });

  it('returns the correct max batch size when specified and need to fetch less than MAX_BATCH SIZE', () => {
    expect(calculateNextBatchSize({ maxResults: MAX_BATCH_RESULTS / 2, dataPointsFetched: 0 })).toBe(
      MAX_BATCH_RESULTS / 2
    );
    expect(calculateNextBatchSize({ maxResults: MAX_BATCH_RESULTS, dataPointsFetched: MAX_BATCH_RESULTS / 2 })).toBe(
      MAX_BATCH_RESULTS / 2
    );
  });
});

describe('shouldFetchNextBatch', () => {
  it('returns true if next token exists and batch has no limit', () => {
    expect(shouldFetchNextBatch({ nextToken: '123', maxResults: NO_LIMIT_BATCH, dataPointsFetched: 0 })).toBe(true);
    expect(shouldFetchNextBatch({ nextToken: '123', maxResults: NO_LIMIT_BATCH, dataPointsFetched: 500000 })).toBe(
      true
    );
  });

  it('returns true if next token exists and there is still data that needs to be fetched', () => {
    expect(shouldFetchNextBatch({ nextToken: '123', maxResults: 3000, dataPointsFetched: 0 })).toBe(true);
    expect(shouldFetchNextBatch({ nextToken: '123', maxResults: 10000, dataPointsFetched: 9999 })).toBe(true);
  });

  it('returns false if next token exists but data points have already been fetched', () => {
    expect(shouldFetchNextBatch({ nextToken: '123', maxResults: 3000, dataPointsFetched: 3000 })).toBe(false);
    expect(shouldFetchNextBatch({ nextToken: '123', maxResults: 0, dataPointsFetched: 0 })).toBe(false);
  });

  it('returns false if next token does not exist', () => {
    expect(shouldFetchNextBatch({ nextToken: undefined, maxResults: 3000, dataPointsFetched: 0 })).toBe(false);
  });
});
