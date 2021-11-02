import { DataStream, DataStreamInfo } from '@synchro-charts/core';
import flushPromises from 'flush-promises';
import { IotAppKitDataModule } from './index';
import { DATA_STREAM, DATA_STREAM_INFO, STRING_INFO_1 } from '../testing/__mocks__/mockWidgetProperties';
import { AnyDataStreamQuery, DataSource, DataSourceRequest } from './types.d';
import { RequestInfo } from './data-cache/requestTypes';
import { DataStreamsStore, DataStreamStore } from './data-cache/types';
import { EMPTY_CACHE } from './data-cache/caching/caching';
import { createSiteWiseLegacyDataSource } from '../data-sources/site-wise-legacy/data-source';
import { MONTH_IN_MS, SECOND_IN_MS } from '../utils/time';

import Mock = jest.Mock;

// A simple mock data source, which will always immediately return a successful response of your choosing.
const createMockSource = (dataStreams: DataStream[]): DataSource<AnyDataStreamQuery> => ({
  name: 'site-wise',
  initiateRequest: jest.fn(({ onSuccess }: DataSourceRequest<AnyDataStreamQuery>) => onSuccess(dataStreams)),
  getRequestsFromQuery: () =>
    dataStreams.map(({ data, aggregates, ...dataStreamInfo }) => ({
      ...dataStreamInfo,
      start: new Date(),
      end: new Date(),
    })),
});

it('subscribes to an empty set of queries', () => {
  const dataModule = new IotAppKitDataModule();
  const dataSource = createMockSource([]);
  dataModule.registerDataSource(dataSource);

  const onSuccess = jest.fn();
  dataModule.subscribeToDataStreams(
    {
      query: { source: dataSource.name, dataStreamInfos: [] },
      requestInfo: { start: new Date(), end: new Date(), onlyFetchLatestValue: false },
    },
    onSuccess
  );

  expect(onSuccess).toBeCalledWith([]);
});

describe('initial request', () => {
  it('does not load request data streams which are not provided from a data-source', async () => {
    const dataModule = new IotAppKitDataModule();
    const dataSource: DataSource = {
      name: 'site-wise-legacy',
      initiateRequest: jest.fn(),
      getRequestsFromQuery: () => [],
    };

    dataModule.registerDataSource(dataSource);

    const dataStreamCallback = jest.fn();

    const query = { source: dataSource.name, dataStreamInfos: [DATA_STREAM_INFO] };

    await flushPromises();

    dataModule.subscribeToDataStreams(
      {
        query,
        requestInfo: { start: new Date(), end: new Date(), onlyFetchLatestValue: false },
      },
      dataStreamCallback
    );

    expect(dataStreamCallback).toBeCalledWith([]);
    expect(dataSource.initiateRequest).not.toBeCalled();
  });

  it('does load request data streams which are not provided from a data-source', () => {
    const START = new Date(2000, 0, 0);
    const END = new Date();

    const dataModule = new IotAppKitDataModule();
    const dataSource: DataSource = {
      name: 'site-wise-legacy',
      initiateRequest: jest.fn(),
      getRequestsFromQuery: () => [DATA_STREAM_INFO],
    };

    const query = { source: dataSource.name, dataStreamInfos: [DATA_STREAM_INFO] };

    dataModule.registerDataSource(dataSource);

    const dataStreamCallback = jest.fn();

    dataModule.subscribeToDataStreams(
      {
        query,
        requestInfo: { start: START, end: END, onlyFetchLatestValue: false },
      },
      dataStreamCallback
    );
    expect(dataStreamCallback).toBeCalledWith([
      expect.objectContaining({
        id: DATA_STREAM_INFO.id,
        isLoading: true,
        isRefreshing: true,
      } as DataStreamStore),
    ]);

    expect(dataSource.initiateRequest).toBeCalledWith(expect.objectContaining({ query }), [
      { id: DATA_STREAM_INFO.id, resolution: DATA_STREAM_INFO.resolution, start: START, end: END },
    ]);
  });
});

it('subscribes to a single data stream', () => {
  const dataModule = new IotAppKitDataModule();
  const dataSource = createMockSource([DATA_STREAM]);
  dataModule.registerDataSource(dataSource);

  const dataStreamCallback = jest.fn();
  dataModule.subscribeToDataStreams(
    {
      query: { source: 'site-wise', dataStreamInfos: [DATA_STREAM_INFO] },
      requestInfo: { start: new Date(), end: new Date(), onlyFetchLatestValue: false },
    },
    dataStreamCallback
  );

  expect(dataStreamCallback).toBeCalledWith([
    expect.objectContaining({
      id: DATA_STREAM_INFO.id,
      resolution: DATA_STREAM_INFO.resolution,
    }),
  ]);
});

it('throws error when subscribing to a non-existent data source', () => {
  const dataModule = new IotAppKitDataModule();
  expect(() =>
    dataModule.subscribeToDataStreams(
      {
        query: { source: 'fake-source', dataStreamInfos: [] },
        requestInfo: { start: new Date(), end: new Date(), onlyFetchLatestValue: false },
      },
      () => {}
    )
  ).toThrowError(/fake-source/);
});

it('requests data from a custom data source', () => {
  const customSource = createMockSource([DATA_STREAM]);

  const dataModule = new IotAppKitDataModule();
  const onSuccess = jest.fn();

  dataModule.registerDataSource(customSource);

  dataModule.subscribeToDataStreams(
    {
      query: {
        dataStreamInfos: [DATA_STREAM_INFO],
        source: customSource.name,
      },
      requestInfo: { start: new Date(), end: new Date(), onlyFetchLatestValue: false },
    },
    onSuccess
  );

  expect(onSuccess).toHaveBeenCalledWith([expect.objectContaining({ id: DATA_STREAM_INFO.id })]);
});

it('subscribes to multiple data streams', () => {
  const onRequestData = jest.fn();
  const source = createSiteWiseLegacyDataSource(onRequestData);

  const requestInfo: RequestInfo = { start: new Date(1999, 0, 0), end: new Date(), onlyFetchLatestValue: false };
  const dataStreamInfos: DataStreamInfo[] = [STRING_INFO_1, DATA_STREAM_INFO];

  const dataModule = new IotAppKitDataModule();
  const onSuccess = jest.fn();

  dataModule.registerDataSource(source);

  const query = {
    source: source.name,
    dataStreamInfos,
  };
  dataModule.subscribeToDataStreams(
    {
      query,
      requestInfo,
    },
    onSuccess
  );

  expect(onRequestData).toHaveBeenNthCalledWith(1, expect.objectContaining({ dataStreamId: STRING_INFO_1.id }));
  expect(onRequestData).toHaveBeenNthCalledWith(2, expect.objectContaining({ dataStreamId: DATA_STREAM_INFO.id }));
});

it('only requests latest value', () => {
  const onRequestData = jest.fn();
  const source = createSiteWiseLegacyDataSource(onRequestData);

  const dataModule = new IotAppKitDataModule();
  const onSuccess = jest.fn();

  dataModule.registerDataSource(source);

  dataModule.subscribeToDataStreams(
    {
      query: {
        dataStreamInfos: [DATA_STREAM_INFO],
        source: source.name,
      },
      requestInfo: { start: new Date(2000, 0, 0), end: new Date(2001, 0, 0), onlyFetchLatestValue: true },
    },
    onSuccess
  );

  expect(onRequestData).toBeCalledWith(
    expect.objectContaining({ request: expect.objectContaining({ onlyFetchLatestValue: true }) })
  );
});

it.skip('does not request a data stream which has an error associated with it', () => {
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
        error: 'An error has occurred!',
      },
    },
  };

  const customSource = createMockSource([]);

  const dataModule = new IotAppKitDataModule(CACHE_WITH_ERROR);

  const onSuccess = jest.fn();

  dataModule.registerDataSource(customSource);

  dataModule.subscribeToDataStreams(
    {
      query: {
        dataStreamInfos: [DATA_STREAM_INFO],
        source: customSource.name,
      },
      requestInfo: { start: new Date(2000, 0, 0), end: new Date(), onlyFetchLatestValue: false },
    },
    onSuccess
  );

  expect(onSuccess).not.toBeCalled();
});

describe('caching', () => {
  it('does not request already cached data', () => {
    const dataModule = new IotAppKitDataModule();
    const dataSource = createMockSource([DATA_STREAM]);
    dataModule.registerDataSource(dataSource);

    const START_1 = new Date(2000, 1, 0);
    const END_1 = new Date(2000, 2, 0);

    const START_2 = new Date(2001, 1, 0);
    const END_2 = new Date(2001, 2, 0);

    const dataStreamCallback = jest.fn();
    const { update } = dataModule.subscribeToDataStreams(
      {
        query: { source: 'site-wise', dataStreamInfos: [DATA_STREAM_INFO] },
        requestInfo: { start: START_1, end: END_1, onlyFetchLatestValue: false },
      },
      dataStreamCallback
    );

    update({ requestInfo: { start: START_2, end: END_2, onlyFetchLatestValue: false } });

    (dataSource.initiateRequest as Mock).mockClear();

    update({ requestInfo: { start: START_1, end: END_1, onlyFetchLatestValue: false } });
    expect(dataSource.initiateRequest).not.toBeCalled();
  });

  it('requests only uncached data', () => {
    const dataModule = new IotAppKitDataModule();
    const dataSource = createMockSource([DATA_STREAM]);
    dataModule.registerDataSource(dataSource);

    // Order of points through time:
    // [START_2 ---- [START_1 ----- END_1] ------ END_2] ----->
    // results in the intervals requested from the cache
    // [START_2 ----- START_1]      [END_1 ------- END_2]
    // Which omits the time in-between START_1 and END_1 (The inner interval of time).
    const START_1 = new Date(2000, 1, 0);
    const END_1 = new Date(2000, 2, 0);
    const START_2 = new Date(START_1.getTime() - MONTH_IN_MS);
    const END_2 = new Date(END_1.getTime() + MONTH_IN_MS);

    const dataStreamCallback = jest.fn();
    const { update } = dataModule.subscribeToDataStreams(
      {
        query: { source: 'site-wise', dataStreamInfos: [DATA_STREAM_INFO] },
        requestInfo: { start: START_1, end: END_1, onlyFetchLatestValue: false },
      },
      dataStreamCallback
    );

    (dataSource.initiateRequest as Mock).mockClear();

    update({ requestInfo: { start: START_2, end: END_2, onlyFetchLatestValue: false } });

    expect(dataSource.initiateRequest).toBeCalledWith(expect.any(Object), [
      {
        id: DATA_STREAM.id,
        resolution: DATA_STREAM.resolution,
        start: START_2,
        end: START_1,
      },
      {
        id: DATA_STREAM.id,
        resolution: DATA_STREAM.resolution,
        start: END_1,
        end: END_2,
      },
    ]);
  });

  it('immediately request when subscribed to an entirely new time interval not previously requested', () => {
    const dataModule = new IotAppKitDataModule();
    const dataSource = createMockSource([DATA_STREAM]);
    dataModule.registerDataSource(dataSource);

    const START_1 = new Date(2000, 1, 0);
    const END_1 = new Date(2000, 2, 0);
    const START_2 = new Date(1991, 0, 0);
    const END_2 = new Date(1999, 1, 0);

    const dataStreamCallback = jest.fn();
    const { update } = dataModule.subscribeToDataStreams(
      {
        query: { source: 'site-wise', dataStreamInfos: [DATA_STREAM_INFO] },
        requestInfo: { start: START_1, end: END_1, onlyFetchLatestValue: false },
      },
      dataStreamCallback
    );

    (dataSource.initiateRequest as Mock).mockClear();

    update({ requestInfo: { start: START_2, end: END_2, onlyFetchLatestValue: false } });

    expect(dataSource.initiateRequest).toBeCalledWith(expect.any(Object), [
      {
        id: DATA_STREAM_INFO.id,
        resolution: DATA_STREAM_INFO.resolution,
        start: START_2,
        end: END_2,
      },
    ]);
  });
});

describe('request scheduler', () => {
  /**
   * First time it subscribe it says theres no existing dat streams
   * second time you request and it changes to isLoading = true
   * 3rd time, the data is here and isLoading = false;
   */
  const DATA_STREAM_CB_MULTIPLIER = 3;
  it('starts the request scheduler when subscribe to data stream with duration', () => {
    jest.useFakeTimers();

    const dataModule = new IotAppKitDataModule();
    const dataSource = createMockSource([DATA_STREAM]);
    dataModule.registerDataSource(dataSource);

    const dataStreamCallback = jest.fn();
    dataModule.subscribeToDataStreams(
      {
        query: { source: 'site-wise', dataStreamInfos: [DATA_STREAM_INFO] },
        requestInfo: { duration: SECOND_IN_MS, onlyFetchLatestValue: false },
      },
      dataStreamCallback
    );

    const secondsElapsed = 2.4;
    jest.advanceTimersByTime(secondsElapsed * SECOND_IN_MS);

    expect(dataStreamCallback).toBeCalledTimes(
      DATA_STREAM_CB_MULTIPLIER + Math.floor(secondsElapsed) * DATA_STREAM_CB_MULTIPLIER
    );
  });

  it('stops requesting for data after unsubscribe from the data module', () => {
    jest.useFakeTimers();

    const dataModule = new IotAppKitDataModule();
    const dataSource = createMockSource([DATA_STREAM]);
    dataModule.registerDataSource(dataSource);

    const dataStreamCallback = jest.fn();
    const { unsubscribe } = dataModule.subscribeToDataStreams(
      {
        query: { source: 'site-wise', dataStreamInfos: [DATA_STREAM_INFO] },
        requestInfo: { duration: SECOND_IN_MS, onlyFetchLatestValue: false },
      },
      dataStreamCallback
    );

    const secondsElapsed = 2.4;
    jest.advanceTimersByTime(secondsElapsed * SECOND_IN_MS);
    unsubscribe();
    dataStreamCallback.mockClear();

    jest.advanceTimersByTime(secondsElapsed * SECOND_IN_MS);
    expect(dataStreamCallback).not.toHaveBeenCalled();
  });

  it('starts the request scheduler when the request info gets updated from static viewport to duration', () => {
    jest.useFakeTimers();

    const dataModule = new IotAppKitDataModule();
    const dataSource = createMockSource([DATA_STREAM]);
    dataModule.registerDataSource(dataSource);

    const dataStreamCallback = jest.fn();
    const { update } = dataModule.subscribeToDataStreams(
      {
        query: { source: 'site-wise', dataStreamInfos: [DATA_STREAM_INFO] },
        requestInfo: { start: new Date(2000, 0, 0), end: new Date(2001, 0, 0), onlyFetchLatestValue: false },
      },
      dataStreamCallback
    );

    const secondsElapsed = 2.4;
    jest.advanceTimersByTime(secondsElapsed * SECOND_IN_MS);

    // Does not call more than its initial request since it is a static viewport
    expect(dataStreamCallback).toBeCalledTimes(DATA_STREAM_CB_MULTIPLIER);
    dataStreamCallback.mockClear();

    update({ requestInfo: { duration: SECOND_IN_MS, onlyFetchLatestValue: false } });

    jest.advanceTimersByTime(secondsElapsed * SECOND_IN_MS);

    expect(dataStreamCallback).toBeCalledTimes(
      DATA_STREAM_CB_MULTIPLIER + Math.floor(secondsElapsed) * DATA_STREAM_CB_MULTIPLIER
    );
  });

  it('stops the request scheduler when we first update request info to have duration and then call unsubscribe', () => {
    jest.useFakeTimers();

    const dataModule = new IotAppKitDataModule();
    const dataSource = createMockSource([DATA_STREAM]);
    dataModule.registerDataSource(dataSource);

    const dataStreamCallback = jest.fn();
    const { update, unsubscribe } = dataModule.subscribeToDataStreams(
      {
        query: { source: 'site-wise', dataStreamInfos: [DATA_STREAM_INFO] },
        requestInfo: { start: new Date(2000, 0, 0), end: new Date(2001, 0, 0), onlyFetchLatestValue: false },
      },
      dataStreamCallback
    );

    const secondsElapsed = 2.4;
    jest.advanceTimersByTime(secondsElapsed * SECOND_IN_MS);

    // Does not call more than its initial request since it is a static viewport
    expect(dataStreamCallback).toBeCalledTimes(DATA_STREAM_CB_MULTIPLIER);
    dataStreamCallback.mockClear();

    // Update the request info to trigger the live mode
    update({ requestInfo: { duration: SECOND_IN_MS, onlyFetchLatestValue: false } });

    // Let live mode run for some time
    jest.advanceTimersByTime(secondsElapsed * SECOND_IN_MS);

    unsubscribe();
    dataStreamCallback.mockClear();

    jest.advanceTimersByTime(secondsElapsed * SECOND_IN_MS);
    expect(dataStreamCallback).not.toHaveBeenCalled();
  });

  it('stops the request scheduler when request info gets updated with static viewport', () => {
    jest.useFakeTimers();

    const dataModule = new IotAppKitDataModule();
    const dataSource = createMockSource([DATA_STREAM]);
    dataModule.registerDataSource(dataSource);

    const dataStreamCallback = jest.fn();
    const { update } = dataModule.subscribeToDataStreams(
      {
        query: { source: 'site-wise', dataStreamInfos: [DATA_STREAM_INFO] },
        requestInfo: { duration: SECOND_IN_MS, onlyFetchLatestValue: false },
      },
      dataStreamCallback
    );

    const secondsElapsed = 2.4;
    jest.advanceTimersByTime(secondsElapsed * SECOND_IN_MS);

    dataStreamCallback.mockClear();
    update({ requestInfo: { start: new Date(2000, 0, 0), end: new Date(2001, 0, 0), onlyFetchLatestValue: false } });

    jest.advanceTimersByTime(secondsElapsed * SECOND_IN_MS);

    expect(dataStreamCallback).toBeCalledTimes(DATA_STREAM_CB_MULTIPLIER);
  });
});
