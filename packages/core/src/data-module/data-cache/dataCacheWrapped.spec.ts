import { DataCache } from './dataCacheWrapped';
import { SECOND_IN_MS } from '../../common/time';
import { DataStreamsStore } from './types';
import { AggregateType } from '@aws-sdk/client-iotsitewise';
import { EMPTY_CACHE } from './caching/caching';
import { DataStream, DataStreamInfo, DataType } from '@synchro-charts/core';

const DATA_STREAM_INFO: DataStreamInfo = {
  id: 'some-asset-id---some-property-id',
  resolution: 0,
  detailedName: 'data-stream-name/detailed-name',
  name: 'data-stream-name',
  color: 'black',
  dataType: DataType.NUMBER,
};

const AGGREGATE_TYPE = AggregateType.AVERAGE;

const DATA_STREAM: DataStream<number> = {
  ...DATA_STREAM_INFO,
  data: [],
};

it('initializes', () => {
  expect(() => new DataCache()).not.toThrowError();
});

describe('shouldRequestDataStream', () => {
  const ERR = { msg: 'An error has occurred!', type: 'ResourceNotFoundException', status: '404' };

  const CACHE_WITH_ERROR: DataStreamsStore = {
    [DATA_STREAM_INFO.id]: {
      rawData: {
        id: DATA_STREAM.id,
        aggregationType: AGGREGATE_TYPE,
        resolution: DATA_STREAM.resolution,
        dataCache: EMPTY_CACHE,
        requestCache: EMPTY_CACHE,
        requestHistory: [],
        isLoading: false,
        isRefreshing: false,
        error: ERR,
      },
    },
  };

  const CACHE_WITHOUT_ERROR: DataStreamsStore = {
    [DATA_STREAM_INFO.id]: {
      [DATA_STREAM_INFO.resolution]: {
        [AGGREGATE_TYPE]: {
          id: DATA_STREAM.id,
          resolution: DATA_STREAM.resolution,
          aggregationType: AGGREGATE_TYPE,
          dataCache: EMPTY_CACHE,
          requestCache: EMPTY_CACHE,
          requestHistory: [],
          isLoading: false,
          isRefreshing: false,
          error: undefined,
        },
      },
    },
  };

  it('should not request data stream when error associated with DataStream', () => {
    const cache = new DataCache(CACHE_WITH_ERROR);

    expect(
      cache.shouldRequestDataStream({
        dataStreamId: DATA_STREAM.id,
        resolution: DATA_STREAM.resolution,
        aggregationType: AGGREGATE_TYPE,
      })
    ).toBe(false);
  });

  it('should request data stream when no error associated with DataStream', () => {
    const cache = new DataCache(CACHE_WITHOUT_ERROR);

    expect(
      cache.shouldRequestDataStream({
        dataStreamId: DATA_STREAM.id,
        resolution: DATA_STREAM.resolution,
        aggregationType: AGGREGATE_TYPE,
      })
    ).toBe(true);
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

    dataCache.onRequest({
      id: ID,
      resolution: '1s',
      start: new Date(),
      end: new Date(),
      aggregationType: AGGREGATE_TYPE,
    });
    const state = dataCache.getState();

    expect(state?.[ID]?.resolutions?.[RESOLUTION]?.[AGGREGATE_TYPE]).toEqual(
      expect.objectContaining({
        isLoading: true,
      })
    );
  });

  it('onError works', () => {
    const dataCache = new DataCache();

    const ID = 'some-id';
    const RESOLUTION = SECOND_IN_MS;
    const ERROR = { msg: 'some error', type: 'ResourceNotFoundException', status: '404' };

    dataCache.onError({ id: ID, resolution: RESOLUTION, aggregationType: AGGREGATE_TYPE, error: ERROR });
    const state = dataCache.getState();

    expect(state?.[ID]?.resolutions?.[RESOLUTION]?.[AGGREGATE_TYPE]).toEqual(
      expect.objectContaining({
        error: ERROR,
        aggregationType: AGGREGATE_TYPE,
      })
    );
  });

  it('onSuccess works for raw data', () => {
    const DATA_STREAM = {
      id: 'some-id',
      resolution: 0,
      detailedName: 'data-stream-name/detailed-name',
      name: 'data-stream-name',
      color: 'black',
      dataType: DataType.NUMBER,
      data: [],
    };
    const dataCache = new DataCache();

    const start = new Date(2000, 0, 0);
    const end = new Date(2000, 1, 1);

    dataCache.onSuccess(
      [DATA_STREAM],
      {
        id: 'some-id',
        resolution: '0',
        fetchFromStartToEnd: true,
        start,
        end,
      },
      start,
      end
    );
    const state = dataCache.getState() as DataStreamsStore;
    expect(state[DATA_STREAM.id]?.rawData).toBeDefined();
  });

  it('onSuccess works for aggregate data', () => {
    const DATA_STREAM = {
      id: 'some-id',
      resolution: 100,
      detailedName: 'data-stream-name/detailed-name',
      name: 'data-stream-name',
      color: 'black',
      dataType: DataType.NUMBER,
      data: [],
    };
    const dataCache = new DataCache();

    const start = new Date(2000, 0, 0);
    const end = new Date(2000, 1, 1);

    dataCache.onSuccess(
      [DATA_STREAM],
      {
        id: 'some-id',
        resolution: '100',
        fetchFromStartToEnd: true,
        aggregationType: AGGREGATE_TYPE,
        start,
        end,
      },
      start,
      end
    );
    const state = dataCache.getState() as DataStreamsStore;
    expect(state[DATA_STREAM.id]?.resolutions?.[100]?.[AGGREGATE_TYPE]).toBeDefined();
    expect(state[DATA_STREAM.id]?.rawData).toBeUndefined();
  });
});
