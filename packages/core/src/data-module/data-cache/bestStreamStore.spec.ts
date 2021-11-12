import { getBestStreamStore } from './bestStreamStore';
import { DataStreamStore } from './types';
import { EMPTY_CACHE } from './caching/caching';

describe(' get best stream store based', () => {
  it('returns undefined if there are no stream stores', () => {
    expect(getBestStreamStore('data-stream-id', 0, {})).toBeUndefined();
  });

  it('returns undefined if no data streams of a given id are available at the requested resolution or larger', () => {
    expect(
      getBestStreamStore('data-stream-id', 100, {
        'data-stream-id': {
          0: {
            id: 'data-stream-id',
            resolution: 0,
            requestHistory: [],
            isLoading: false,
            isRefreshing: false,
            requestCache: EMPTY_CACHE,
            dataCache: EMPTY_CACHE,
          },
        },
      })
    ).toBeUndefined();
  });

  it('returns requested exact resolution for a given `dataStreamId`, if the data stream is present', () => {
    const STREAM_STORE: DataStreamStore = {
      id: 'data-stream-id',
      resolution: 0,
      requestHistory: [],
      isLoading: false,
      isRefreshing: false,
      requestCache: EMPTY_CACHE,
      dataCache: EMPTY_CACHE,
    };
    expect(
      getBestStreamStore(STREAM_STORE.id, 0, {
        [STREAM_STORE.id]: {
          0: STREAM_STORE,
        },
      })
    ).toBe(STREAM_STORE);
  });

  it('returns data stream of a higher aggregation of the exact resolution is not available', () => {
    const STREAM_STORE: DataStreamStore = {
      id: 'data-stream-id',
      requestHistory: [],
      resolution: 100,
      isLoading: false,
      isRefreshing: false,
      requestCache: EMPTY_CACHE,
      dataCache: EMPTY_CACHE,
    };
    expect(
      getBestStreamStore(STREAM_STORE.id, 0, {
        [STREAM_STORE.id]: {
          100: STREAM_STORE,
        },
      })
    ).toBe(STREAM_STORE);
  });

  it('returns data stream of several aggregations higher if it is the smallest resolution available greater then requested resolution', () => {
    const STREAM_STORE: DataStreamStore = {
      id: 'data-stream-id',
      resolution: 100,
      requestHistory: [],
      isLoading: false,
      isRefreshing: false,
      requestCache: EMPTY_CACHE,
      dataCache: EMPTY_CACHE,
    };
    const STREAM_STORE_TWO: DataStreamStore = {
      id: 'data-stream-id-2',
      requestHistory: [],
      resolution: 0,
      isLoading: true,
      isRefreshing: true,
      requestCache: EMPTY_CACHE,
      dataCache: EMPTY_CACHE,
    };
    expect(
      getBestStreamStore('data-stream-id', 0, {
        [STREAM_STORE_TWO.id]: {
          0: STREAM_STORE_TWO,
        },
        [STREAM_STORE.id]: {
          100: STREAM_STORE,
        },
      })
    ).toBe(STREAM_STORE);
  });

  it('does not return a stream store which is not the exact resolution of the request, which has an error', () => {
    const ID = 'data-stream-store';
    const STREAM_STORE: DataStreamStore = {
      id: ID,
      resolution: 100,
      requestHistory: [],
      isLoading: false,
      isRefreshing: false,
      requestCache: EMPTY_CACHE,
      dataCache: EMPTY_CACHE,
    };
    expect(
      getBestStreamStore(ID, 0, {
        [ID]: {
          50: {
            id: ID,
            resolution: 50,
            error: 'woah an error!',
            requestHistory: [],
            isLoading: false,
            isRefreshing: false,
            requestCache: EMPTY_CACHE,
            dataCache: EMPTY_CACHE,
          },
          100: STREAM_STORE,
        },
      })
    ).toBe(STREAM_STORE);
  });

  it('returns an error if it has the exact resolution', () => {
    const ID = 'data-stream-store';
    const STREAM_STORE: DataStreamStore = {
      id: ID,
      requestHistory: [],
      isLoading: false,
      resolution: 100,
      isRefreshing: false,
      requestCache: EMPTY_CACHE,
      dataCache: EMPTY_CACHE,
    };
    const ERROR_STORE: DataStreamStore = {
      id: ID,
      requestHistory: [],
      error: 'woah an error!',
      resolution: 0,
      isLoading: false,
      isRefreshing: false,
      requestCache: EMPTY_CACHE,
      dataCache: EMPTY_CACHE,
    };
    expect(
      getBestStreamStore(ID, 0, {
        [ID]: {
          0: ERROR_STORE,
          100: STREAM_STORE,
        },
      })
    ).toBe(ERROR_STORE);
  });
});
