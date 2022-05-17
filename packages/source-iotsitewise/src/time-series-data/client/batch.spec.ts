import { createEntryBatches } from './batch';

describe('createEntryBatches', () => {
  it('buckets entries by maxResults', () => {
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
          4000,
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

  it('handles empty input', () => {
    const batches = createEntryBatches([]);
    expect(batches).toEqual([]);
  });
});
