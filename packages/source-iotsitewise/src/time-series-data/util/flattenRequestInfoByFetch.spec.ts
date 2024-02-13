import { flattenRequestInfoByFetch } from './flattenRequestInfoByFetch';

describe('flattenRequestInfoByFetch', () => {
  it('flattens by fetchXxx fields', () => {
    const baseRequestInfo = {
      id: 'id',
      resolution: '1h',
      start: new Date(),
      end: new Date(),
    };

    const requestInfoMostRecentBeforeStart = {
      ...baseRequestInfo,
      fetchMostRecentBeforeStart: true,
    };

    const requestInfoMostRecentBeforeEnd = {
      ...baseRequestInfo,
      fetchMostRecentBeforeEnd: true,
    };

    const requestInfoFromStartToEnd = {
      ...baseRequestInfo,
      fetchFromStartToEnd: true,
    };

    const requestInfo = {
      ...baseRequestInfo,
      fetchMostRecentBeforeStart: true,
      fetchMostRecentBeforeEnd: true,
      fetchFromStartToEnd: true,
    };

    expect(flattenRequestInfoByFetch(requestInfo)).toEqual(
      expect.arrayContaining([
        requestInfoMostRecentBeforeStart,
        requestInfoMostRecentBeforeEnd,
        requestInfoFromStartToEnd,
      ])
    );
  });
});
