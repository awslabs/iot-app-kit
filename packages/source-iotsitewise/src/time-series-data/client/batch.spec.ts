import { createEntryBatches, shouldFetchNextBatch } from './batch';

describe('createEntryBatches', () => {
  it('buckets entries by maxResults for a given batch', () => {
    const batches = createEntryBatches(
      [
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
      ],
      16
    );

    expect(batches).toEqual(
      expect.arrayContaining([
        [
          [
            {
              id: '1',
              maxResults: undefined,
            },
          ],
          -1,
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
          2000,
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

  it('chunks batches that exceed max batch size', () => {
    const entrySize = 2000;
    const batchSize = 16;

    const entries = [
      ...[...Array(batchSize * 3)].map((_args, index) => ({
        id: String(index),
        maxResults: entrySize,
      })),
      {
        id: 'abc',
        maxResults: 10,
      },
    ];

    const batches = createEntryBatches(entries, 16);

    expect(batches).toEqual(
      expect.arrayContaining([
        [entries.slice(0, batchSize), entrySize],
        [entries.slice(batchSize, 2 * batchSize), entrySize],
        [entries.slice(batchSize * 2, batchSize * 3), entrySize],
        [[entries[batchSize * 3]], 10],
      ])
    );
  });

  it('handles empty input', () => {
    const batches = createEntryBatches([], 16);
    expect(batches).toEqual([]);
  });
});

describe('shouldFetchNextBatch', () => {
  it('returns true if next token exists', () => {
    expect(shouldFetchNextBatch({ nextToken: '123' })).toBe(true);
  });

  it('returns false if next token does not exist', () => {
    expect(shouldFetchNextBatch({ nextToken: undefined })).toBe(false);
  });
});
