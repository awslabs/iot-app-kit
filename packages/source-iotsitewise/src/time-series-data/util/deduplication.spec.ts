import { deduplicateBatch } from './deduplication';

describe('deduplicateBatch', () => {
  it('removes duplicate entries from a given batch', () => {
    const entry = {
      onError: vi.fn(),
      onSuccess: vi.fn(),
      requestEnd: new Date(2001, 0, 0),
      requestStart: new Date(2000, 0, 0),
      requestInformation: {
        id: 'asset-property',
        start: new Date(2001, 0, 0),
        end: new Date(2000, 0, 0),
        resolution: '0',
        fetchMostRecentBeforeEnd: true,
      },
    };

    const originalBatch = [entry, entry];
    const deduplicatedBatch = [entry];

    expect(deduplicateBatch(originalBatch)).toEqual(deduplicatedBatch);
  });
});
