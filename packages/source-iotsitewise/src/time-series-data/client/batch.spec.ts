import {
  createRawLatestEntryBatches,
  createRawHistoricalEntryBatches,
  createAggregateEntryBatches,
  calculateNextRawHistoricalBatchSize,
  calculateNextAggregatedBatchSize,
  shouldFetchNextBatch,
  NO_LIMIT_BATCH,
} from './batch';
import {
  MAX_AGGREGATED_DATA_POINTS,
  MAX_RAW_HISTORICAL_DATA_POINTS,
  MAX_RAW_LATEST_REQUEST_ENTRIES,
  MAX_RAW_HISTORICAL_REQUEST_ENTRIES,
  MAX_AGGREGATED_REQUEST_ENTRIES,
} from './constants';

describe('createRawLatestEntryBatches', () => {
  it('buckets entries by maxResults for a given batch', () => {
    const batches = createRawLatestEntryBatches([
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

  it('chunks batches that exceed max entry size (128)', () => {
    const entrySize = 2000;

    const entries = [
      ...[...Array(MAX_RAW_LATEST_REQUEST_ENTRIES * 3)].map((_args, index) => ({
        id: String(index),
        maxResults: entrySize,
      })),
      {
        id: 'abc',
        maxResults: 10,
      },
    ];

    const batches = createRawLatestEntryBatches(entries);

    expect(batches).toEqual(
      expect.arrayContaining([
        [entries.slice(0, MAX_RAW_LATEST_REQUEST_ENTRIES), MAX_RAW_LATEST_REQUEST_ENTRIES * entrySize],
        [
          entries.slice(MAX_RAW_LATEST_REQUEST_ENTRIES, 2 * MAX_RAW_LATEST_REQUEST_ENTRIES),
          MAX_RAW_LATEST_REQUEST_ENTRIES * entrySize,
        ],
        [
          entries.slice(MAX_RAW_LATEST_REQUEST_ENTRIES * 2, MAX_RAW_LATEST_REQUEST_ENTRIES * 3),
          MAX_RAW_LATEST_REQUEST_ENTRIES * entrySize,
        ],
        [[entries[MAX_RAW_LATEST_REQUEST_ENTRIES * 3]], 10],
      ])
    );
  });

  it('handles empty input', () => {
    const batches = createRawLatestEntryBatches([]);
    expect(batches).toEqual([]);
  });
});

describe('createRawHistoricalEntryBatches', () => {
  it('buckets entries by maxResults for a given batch', () => {
    const batches = createRawHistoricalEntryBatches([
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
      ...[...Array(MAX_RAW_HISTORICAL_REQUEST_ENTRIES * 3)].map((_args, index) => ({
        id: String(index),
        maxResults: entrySize,
      })),
      {
        id: 'abc',
        maxResults: 10,
      },
    ];

    const batches = createRawHistoricalEntryBatches(entries);

    expect(batches).toEqual(
      expect.arrayContaining([
        [entries.slice(0, MAX_RAW_HISTORICAL_REQUEST_ENTRIES), MAX_RAW_HISTORICAL_REQUEST_ENTRIES * entrySize],
        [
          entries.slice(MAX_RAW_HISTORICAL_REQUEST_ENTRIES, 2 * MAX_RAW_HISTORICAL_REQUEST_ENTRIES),
          MAX_RAW_HISTORICAL_REQUEST_ENTRIES * entrySize,
        ],
        [
          entries.slice(MAX_RAW_HISTORICAL_REQUEST_ENTRIES * 2, MAX_RAW_HISTORICAL_REQUEST_ENTRIES * 3),
          MAX_RAW_HISTORICAL_REQUEST_ENTRIES * entrySize,
        ],
        [[entries[MAX_RAW_HISTORICAL_REQUEST_ENTRIES * 3]], 10],
      ])
    );
  });

  it('handles empty input', () => {
    const batches = createRawHistoricalEntryBatches([]);
    expect(batches).toEqual([]);
  });
});

describe('createAggregateEntryBatches', () => {
  it('buckets entries by maxResults for a given batch', () => {
    const batches = createAggregateEntryBatches([
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
      ...[...Array(MAX_AGGREGATED_REQUEST_ENTRIES * 3)].map((_args, index) => ({
        id: String(index),
        maxResults: entrySize,
      })),
      {
        id: 'abc',
        maxResults: 10,
      },
    ];

    const batches = createAggregateEntryBatches(entries);

    expect(batches).toEqual(
      expect.arrayContaining([
        [entries.slice(0, MAX_AGGREGATED_REQUEST_ENTRIES), MAX_AGGREGATED_REQUEST_ENTRIES * entrySize],
        [
          entries.slice(MAX_AGGREGATED_REQUEST_ENTRIES, 2 * MAX_AGGREGATED_REQUEST_ENTRIES),
          MAX_AGGREGATED_REQUEST_ENTRIES * entrySize,
        ],
        [
          entries.slice(MAX_AGGREGATED_REQUEST_ENTRIES * 2, MAX_AGGREGATED_REQUEST_ENTRIES * 3),
          MAX_AGGREGATED_REQUEST_ENTRIES * entrySize,
        ],
        [[entries[MAX_AGGREGATED_REQUEST_ENTRIES * 3]], 10],
      ])
    );
  });

  it('handles empty input', () => {
    const batches = createAggregateEntryBatches([]);
    expect(batches).toEqual([]);
  });
});

describe('calculateNextRawHistoricalBatchSize', () => {
  it('returns the correct max batch size for no limit batches', () => {
    expect(calculateNextRawHistoricalBatchSize({ maxResults: NO_LIMIT_BATCH, dataPointsFetched: 0 })).toBe(
      MAX_RAW_HISTORICAL_DATA_POINTS
    );
    expect(calculateNextRawHistoricalBatchSize({ maxResults: NO_LIMIT_BATCH, dataPointsFetched: 100000 })).toBe(
      MAX_RAW_HISTORICAL_DATA_POINTS
    );
  });

  it('returns the correct max batch size when specified and need to fetch more than MAX_RAW_HISTORICAL_DATA_POINTS', () => {
    expect(
      calculateNextRawHistoricalBatchSize({ maxResults: MAX_RAW_HISTORICAL_DATA_POINTS * 3, dataPointsFetched: 0 })
    ).toBe(MAX_RAW_HISTORICAL_DATA_POINTS);
  });

  it('returns the correct max batch size when specified and need to fetch less than MAX_RAW_HISTORICAL_DATA_POINTS', () => {
    expect(
      calculateNextRawHistoricalBatchSize({ maxResults: MAX_RAW_HISTORICAL_DATA_POINTS / 2, dataPointsFetched: 0 })
    ).toBe(MAX_RAW_HISTORICAL_DATA_POINTS / 2);
    expect(
      calculateNextRawHistoricalBatchSize({
        maxResults: MAX_RAW_HISTORICAL_DATA_POINTS,
        dataPointsFetched: MAX_RAW_HISTORICAL_DATA_POINTS / 2,
      })
    ).toBe(MAX_RAW_HISTORICAL_DATA_POINTS / 2);
  });
});

describe('calculateNextAggregatedBatchSize', () => {
  it('returns the correct max batch size for no limit batches', () => {
    expect(calculateNextAggregatedBatchSize({ maxResults: NO_LIMIT_BATCH, dataPointsFetched: 0 })).toBe(
      MAX_AGGREGATED_DATA_POINTS
    );
    expect(calculateNextAggregatedBatchSize({ maxResults: NO_LIMIT_BATCH, dataPointsFetched: 100000 })).toBe(
      MAX_AGGREGATED_DATA_POINTS
    );
  });

  it('returns the correct max batch size when specified and need to fetch more than MAX_AGGREGATED_DATA_POINTS', () => {
    expect(calculateNextAggregatedBatchSize({ maxResults: MAX_AGGREGATED_DATA_POINTS * 3, dataPointsFetched: 0 })).toBe(
      MAX_AGGREGATED_DATA_POINTS
    );
  });

  it('returns the correct max batch size when specified and need to fetch less than MAX_AGGREGATED_DATA_POINTS', () => {
    expect(calculateNextAggregatedBatchSize({ maxResults: MAX_AGGREGATED_DATA_POINTS / 2, dataPointsFetched: 0 })).toBe(
      MAX_AGGREGATED_DATA_POINTS / 2
    );
    expect(
      calculateNextAggregatedBatchSize({
        maxResults: MAX_AGGREGATED_DATA_POINTS,
        dataPointsFetched: MAX_AGGREGATED_DATA_POINTS / 2,
      })
    ).toBe(MAX_AGGREGATED_DATA_POINTS / 2);
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
