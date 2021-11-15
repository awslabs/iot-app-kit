import { DataCache } from './dataCacheWrapped';
import { SECOND_IN_MS } from '../../common/time';
import { DATA_STREAM, DATA_STREAM_INFO } from '../../testing/__mocks__/mockWidgetProperties';
import { DataStreamsStore } from './types';
import { EMPTY_CACHE } from './caching/caching';

it('initializes', () => {
  expect(() => new DataCache()).not.toThrowError();
});

describe('shouldRequestDataStream', () => {
  const ERR_MSG = 'An error has occurred!';

  const CACHE_WITH_ERROR: DataStreamsStore = {
    [DATA_STREAM_INFO.id]: {
      [DATA_STREAM_INFO.resolution]: {
        id: DATA_STREAM.id,
        resolution: DATA_STREAM.resolution,
        dataCache: EMPTY_CACHE,
        requestCache: EMPTY_CACHE,
        requestHistory: [],
        isLoading: false,
        isRefreshing: false,
        error: ERR_MSG,
      },
    },
  };

  const CACHE_WITHOUT_ERROR: DataStreamsStore = {
    [DATA_STREAM_INFO.id]: {
      [DATA_STREAM_INFO.resolution]: {
        id: DATA_STREAM.id,
        resolution: DATA_STREAM.resolution,
        dataCache: EMPTY_CACHE,
        requestCache: EMPTY_CACHE,
        requestHistory: [],
        isLoading: false,
        isRefreshing: false,
        error: undefined,
      },
    },
  };

  it('should not request data stream when error associated with DataStream', () => {
    const cache = new DataCache(CACHE_WITH_ERROR);

    expect(cache.shouldRequestDataStream({ dataStreamId: DATA_STREAM.id, resolution: DATA_STREAM.resolution })).toBe(
      false
    );
  });

  it('should request data stream when no error associated with DataStream', () => {
    const cache = new DataCache(CACHE_WITHOUT_ERROR);

    expect(cache.shouldRequestDataStream({ dataStreamId: DATA_STREAM.id, resolution: DATA_STREAM.resolution })).toBe(
      true
    );
  });
});

it('defaults to an empty cache', () => {
  const dataCache = new DataCache();
  expect(dataCache.getState()).toEqual({});
});

describe('actions', () => {
  it('onRequest works', () => {
    const dataCache = new DataCache();

    const ID = 'some-id';
    const RESOLUTION = SECOND_IN_MS;

    dataCache.onRequest({ id: ID, resolution: RESOLUTION, first: new Date(), last: new Date() });
    const state = dataCache.getState() as any;

    expect(state[ID][RESOLUTION]).toEqual(
      expect.objectContaining({
        isLoading: true,
        isRefreshing: true,
      })
    );
  });

  it('onError works', () => {
    const dataCache = new DataCache();

    const ID = 'some-id';
    const RESOLUTION = SECOND_IN_MS;
    const ERROR = 'some error';

    dataCache.onError({ id: ID, resolution: RESOLUTION, error: ERROR });
    const state = dataCache.getState() as any;

    expect(state[ID][RESOLUTION]).toEqual(
      expect.objectContaining({
        error: ERROR,
      })
    );
  });

  it('onSuccess works', () => {
    const dataCache = new DataCache();

    dataCache.onSuccess({ onlyFetchLatestValue: false, viewport: { duration: SECOND_IN_MS } })([DATA_STREAM]);
    const state = dataCache.getState() as any;

    expect(state[DATA_STREAM.id][DATA_STREAM.resolution]).toBeDefined();
  });
});
