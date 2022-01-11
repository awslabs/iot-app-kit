import flushPromises from 'flush-promises';
import { DATA_STREAM, DATA_STREAM_INFO, STRING_INFO_1 } from '../testing/__mocks__/mockWidgetProperties';
import { DataSource, DataSourceRequest } from './types.d';
import { DataPoint, DataStream, DataStreamInfo, Resolution } from '@synchro-charts/core';
import { TimeSeriesDataRequest, TimeSeriesDataRequestSettings } from './data-cache/requestTypes';
import { DataStreamsStore, DataStreamStore } from './data-cache/types';
import * as caching from './data-cache/caching/caching';
import { createSiteWiseLegacyDataSource } from '../data-sources/site-wise-legacy/data-source';
import { HOUR_IN_MS, MINUTE_IN_MS, MONTH_IN_MS, SECOND_IN_MS } from '../common/time';
import { IotAppKitDataModule } from './IotAppKitDataModule';

import { SITEWISE_DATA_SOURCE } from '../data-sources/site-wise/data-source';
import { wait } from '../testing/wait';
import { SiteWiseDataStreamQuery } from '../data-sources/site-wise/types';
import { toDataStreamId, toSiteWiseAssetProperty } from '../data-sources/site-wise/util/dataStreamId';

import Mock = jest.Mock;
import { SiteWiseLegacyDataStreamQuery } from '../data-sources/site-wise-legacy';

const { EMPTY_CACHE } = caching;

const { propertyId: PROPERTY_ID, assetId: ASSET_ID } = toSiteWiseAssetProperty(DATA_STREAM.id);

const DATA_STREAM_QUERY: SiteWiseDataStreamQuery = {
  source: 'site-wise',
  assets: [
    {
      assetId: ASSET_ID,
      properties: [{ propertyId: PROPERTY_ID }],
    },
  ],
};

// A simple mock data source, which will always immediately return a successful response of your choosing.
const createMockSiteWiseDataSource = (
  dataStreams: DataStream[],
  resolution: number = 0
): DataSource<SiteWiseDataStreamQuery> => ({
  name: SITEWISE_DATA_SOURCE,
  initiateRequest: jest.fn(({ onSuccess }: DataSourceRequest<SiteWiseDataStreamQuery>) => onSuccess(dataStreams)),
  getRequestsFromQuery: ({ query }) =>
    query.assets
      .map(({ assetId, properties }) =>
        properties.map(({ propertyId }) => ({
          id: toDataStreamId({ assetId, propertyId }),
          resolution,
        }))
      )
      .flat(),
});

it('subscribes to an empty set of queries', async () => {
  const dataModule = new IotAppKitDataModule();
  const dataSource = createMockSiteWiseDataSource([]);
  dataModule.registerDataSource(dataSource);

  const onSuccess = jest.fn();
  dataModule.subscribeToDataStreams(
    {
      query: { source: dataSource.name, assets: [] } as SiteWiseDataStreamQuery,
      request: {
        viewport: { start: new Date(2000, 0, 0), end: new Date(2000, 0, 2) },
        settings: {
          fetchFromStartToEnd: true,
          requestBuffer: 0,
        },
      },
    },
    onSuccess
  );

  expect(onSuccess).not.toBeCalled();
});

describe('update subscription', () => {
  it('provides new data streams when subscription is updated', async () => {
    const dataModule = new IotAppKitDataModule();
    const dataSource = createMockSiteWiseDataSource([DATA_STREAM]);

    dataModule.registerDataSource(dataSource);

    const dataStreamCallback = jest.fn();

    const query: SiteWiseDataStreamQuery = { source: dataSource.name, assets: [] };

    const { update } = dataModule.subscribeToDataStreams(
      {
        query,
        request: {
          viewport: { start: new Date(2000, 0, 0), end: new Date(2001, 0, 0) },
          settings: {
            fetchFromStartToEnd: true,
          },
        },
      },
      dataStreamCallback
    );

    dataStreamCallback.mockClear();
    (dataSource.initiateRequest as Mock).mockClear();

    update({ query: DATA_STREAM_QUERY });

    await flushPromises();
    await wait(SECOND_IN_MS);

    // expect(dataStreamCallback).toHaveBeenLastCalledWith([expect.objectContaining({ id: DATA_STREAM.id })]);
    expect(dataSource.initiateRequest).toBeCalled();
  });
});

describe('initial request', () => {
  it('does not load request data streams which are not provided from a data-source', async () => {
    const dataModule = new IotAppKitDataModule();
    const dataSource: DataSource = {
      name: 'some-data-source',
      initiateRequest: jest.fn(),
      getRequestsFromQuery: () => [],
    };

    dataModule.registerDataSource(dataSource);

    const dataStreamCallback = jest.fn();

    dataModule.subscribeToDataStreams(
      {
        query: { source: dataSource.name },
        request: {
          viewport: { start: new Date(2000, 0, 0), end: new Date(2001, 0, 0) },
          settings: {
            fetchFromStartToEnd: true,
          },
        },
      },
      dataStreamCallback
    );

    expect(dataStreamCallback).not.toBeCalled();
    expect(dataSource.initiateRequest).not.toBeCalled();
  });

  it('initiates a request for a data stream', () => {
    const START = new Date(2000, 0, 0);
    const END = new Date();

    const dataModule = new IotAppKitDataModule();
    const dataSource: DataSource = {
      ...createMockSiteWiseDataSource([DATA_STREAM]),
      initiateRequest: jest.fn(),
    };

    dataModule.registerDataSource(dataSource);

    const dataStreamCallback = jest.fn();

    dataModule.subscribeToDataStreams(
      {
        query: DATA_STREAM_QUERY,
        request: { viewport: { start: START, end: END }, settings: { fetchFromStartToEnd: true } },
      },
      dataStreamCallback
    );
    expect(dataStreamCallback).toBeCalledWith([
      expect.objectContaining({
        id: DATA_STREAM.id,
        isLoading: true,
        isRefreshing: true,
      } as DataStreamStore),
    ]);

    expect(dataSource.initiateRequest).toBeCalledWith(expect.objectContaining({ query: DATA_STREAM_QUERY }), [
      { id: DATA_STREAM.id, resolution: DATA_STREAM.resolution, start: START, end: END },
    ]);
  });
});

it('subscribes to a single data stream', async () => {
  const dataModule = new IotAppKitDataModule();
  const dataSource = createMockSiteWiseDataSource([DATA_STREAM]);
  dataModule.registerDataSource(dataSource);
  const { propertyId, assetId } = toSiteWiseAssetProperty(DATA_STREAM.id);

  const dataStreamCallback = jest.fn();
  dataModule.subscribeToDataStreams(
    {
      query: {
        source: SITEWISE_DATA_SOURCE,
        assets: [
          {
            assetId,
            properties: [{ propertyId }],
          },
        ],
      },
      request: {
        viewport: { start: new Date(2000, 0, 0), end: new Date(2001, 0, 0) },
        settings: { fetchFromStartToEnd: true },
      },
    },
    dataStreamCallback
  );

  await wait(1);

  expect(dataStreamCallback).toBeCalledWith([
    expect.objectContaining({
      id: DATA_STREAM.id,
      resolution: DATA_STREAM.resolution,
    }),
  ]);
});

it('throws error when subscribing to a non-existent data source', () => {
  const dataModule = new IotAppKitDataModule();
  expect(() =>
    dataModule.subscribeToDataStreams(
      {
        query: { source: 'fake-source', assets: [] } as SiteWiseDataStreamQuery,
        request: {
          viewport: { start: new Date(2000, 0, 0), end: new Date(2002, 0, 0) },
          settings: {
            fetchFromStartToEnd: true,
          },
        },
      },
      () => {}
    )
  ).toThrowError(/fake-source/);
});

it('requests data from a custom data source', () => {
  const customSource = createMockSiteWiseDataSource([DATA_STREAM]);
  const { propertyId, assetId } = toSiteWiseAssetProperty(DATA_STREAM.id);

  const dataModule = new IotAppKitDataModule();
  const onSuccess = jest.fn();

  dataModule.registerDataSource(customSource);

  dataModule.subscribeToDataStreams(
    {
      query: {
        assets: [{ assetId, properties: [{ propertyId }] }],
        source: customSource.name,
      } as SiteWiseDataStreamQuery,
      request: {
        viewport: { start: new Date(2000, 0, 0), end: new Date(2001, 0, 0) },
        settings: {
          fetchFromStartToEnd: true,
        },
      },
    },
    onSuccess
  );

  expect(onSuccess).toHaveBeenCalledWith([expect.objectContaining({ id: DATA_STREAM.id })]);
});

it('subscribes to multiple data streams', () => {
  const onRequestData = jest.fn();
  const source = createSiteWiseLegacyDataSource(onRequestData);

  const request: TimeSeriesDataRequest = {
    viewport: { start: new Date(1999, 0, 0), end: new Date() },
    settings: {
      fetchFromStartToEnd: true,
    },
  };
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
      request,
    },
    onSuccess
  );

  expect(onRequestData).toHaveBeenNthCalledWith(1, expect.objectContaining({ dataStreamId: STRING_INFO_1.id }));
  expect(onRequestData).toHaveBeenNthCalledWith(2, expect.objectContaining({ dataStreamId: DATA_STREAM_INFO.id }));
});

it('only requests latest value', () => {
  const onRequestData = jest.fn();
  const source = createSiteWiseLegacyDataSource(onRequestData);

  const LATEST_VALUE_REQUEST_SETTINGS: TimeSeriesDataRequestSettings = { fetchMostRecentBeforeEnd: true };

  const dataModule = new IotAppKitDataModule();
  const onSuccess = jest.fn();

  dataModule.registerDataSource(source);

  dataModule.subscribeToDataStreams(
    {
      query: {
        dataStreamInfos: [DATA_STREAM_INFO],
        source: source.name,
      } as SiteWiseLegacyDataStreamQuery,
      request: {
        viewport: { start: new Date(2000, 0, 0), end: new Date(2001, 0, 0) },
        settings: LATEST_VALUE_REQUEST_SETTINGS,
      },
    },
    onSuccess
  );

  expect(onRequestData).toBeCalledWith(
    expect.objectContaining({
      request: expect.objectContaining({
        settings: LATEST_VALUE_REQUEST_SETTINGS,
      }),
    })
  );
});

describe('error handling', () => {
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

  it('provides a data stream which has an error associated with it on initial subscription', () => {
    const customSource = createMockSiteWiseDataSource([DATA_STREAM]);

    const dataModule = new IotAppKitDataModule({ initialDataCache: CACHE_WITH_ERROR });
    const dataStreamCallback = jest.fn();

    dataModule.registerDataSource(customSource);

    dataModule.subscribeToDataStreams(
      {
        query: DATA_STREAM_QUERY,
        request: {
          viewport: { start: new Date(2000, 0, 0), end: new Date() },
          settings: { fetchFromStartToEnd: true },
        },
      },
      dataStreamCallback
    );

    expect(dataStreamCallback).toBeCalledTimes(1);
    expect(dataStreamCallback).toBeCalledWith([expect.objectContaining({ error: ERR_MSG })]);
  });

  it('does not re-request a data stream with an error associated with it', async () => {
    const customSource = createMockSiteWiseDataSource([DATA_STREAM]);

    const dataModule = new IotAppKitDataModule({ initialDataCache: CACHE_WITH_ERROR });
    const dataStreamCallback = jest.fn();

    dataModule.registerDataSource(customSource);

    dataModule.subscribeToDataStreams(
      {
        query: DATA_STREAM_QUERY,
        request: {
          viewport: { duration: 900000 },
          settings: {
            refreshRate: SECOND_IN_MS / 10,
            fetchFromStartToEnd: true,
          },
        },
      },
      dataStreamCallback
    );

    dataStreamCallback.mockClear();
    await wait(SECOND_IN_MS * 0.11);
    expect(dataStreamCallback).not.toBeCalled();
  });

  it('does request a data stream which has no error associated with it', () => {
    const customSource = createMockSiteWiseDataSource([DATA_STREAM]);

    const dataModule = new IotAppKitDataModule({ initialDataCache: CACHE_WITHOUT_ERROR });

    const dataStreamCallback = jest.fn();

    dataModule.registerDataSource(customSource);

    dataModule.subscribeToDataStreams(
      {
        query: DATA_STREAM_QUERY,
        request: {
          viewport: { start: new Date(2000, 0, 0), end: new Date() },
          settings: { fetchFromStartToEnd: true },
        },
      },
      dataStreamCallback
    );

    expect(dataStreamCallback).toBeCalledTimes(1);
    expect(dataStreamCallback).toBeCalledWith([expect.objectContaining({ error: undefined })]);
  });
});

describe('caching', () => {
  beforeAll(() => {
    jest.useFakeTimers('modern');
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('does not request already cached data', () => {
    const dataModule = new IotAppKitDataModule();
    const dataSource = createMockSiteWiseDataSource([DATA_STREAM]);
    dataModule.registerDataSource(dataSource);

    const START_1 = new Date(2000, 1, 0);
    const END_1 = new Date(2000, 2, 0);

    const START_2 = new Date(2001, 1, 0);
    const END_2 = new Date(2001, 2, 0);

    const dataStreamCallback = jest.fn();
    const { update } = dataModule.subscribeToDataStreams(
      {
        query: DATA_STREAM_QUERY,
        request: { viewport: { start: START_1, end: END_1 }, settings: { fetchFromStartToEnd: true } },
      },
      dataStreamCallback
    );

    update({ request: { viewport: { start: START_2, end: END_2 }, settings: { fetchFromStartToEnd: true } } });

    (dataSource.initiateRequest as Mock).mockClear();

    update({ request: { viewport: { start: START_1, end: END_1 }, settings: { fetchFromStartToEnd: true } } });
    expect(dataSource.initiateRequest).not.toBeCalled();
  });

  it('requests only uncached data', async () => {
    const dataModule = new IotAppKitDataModule();
    const dataSource = createMockSiteWiseDataSource([DATA_STREAM]);
    dataModule.registerDataSource(dataSource);

    // Order of points through time:
    // [START_2 ---- [START_1 ----- END_1] ------ END_2] ----->
    // results in the intervals requested from the cache
    // [START_2 ----- START_1]      [END_1 ------- END_2]
    // Which omits the time in-between START_1 and END_1 (The inner interval of time).
    const START_1 = new Date(2000, 1, 1);
    const END_1 = new Date(2000, 2, 1);
    const START_2 = new Date(START_1.getTime() - MONTH_IN_MS);
    const END_2 = new Date(END_1.getTime() + MONTH_IN_MS);

    const dataStreamCallback = jest.fn();
    const { update } = dataModule.subscribeToDataStreams(
      {
        query: DATA_STREAM_QUERY,
        request: { viewport: { start: START_1, end: END_1 }, settings: { fetchFromStartToEnd: true } },
      },
      dataStreamCallback
    );

    (dataSource.initiateRequest as Mock).mockClear();

    update({ request: { viewport: { start: START_2, end: END_2 }, settings: { fetchFromStartToEnd: true } } });

    await flushPromises();

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
    const dataSource = createMockSiteWiseDataSource([DATA_STREAM]);
    dataModule.registerDataSource(dataSource);

    const START_1 = new Date(2000, 1, 0);
    const END_1 = new Date(2000, 2, 0);
    const START_2 = new Date(1991, 0, 0);
    const END_2 = new Date(1999, 1, 0);

    const dataStreamCallback = jest.fn();
    const { update } = dataModule.subscribeToDataStreams(
      {
        query: DATA_STREAM_QUERY,
        request: { viewport: { start: START_1, end: END_1 }, settings: { fetchFromStartToEnd: true } },
      },
      dataStreamCallback
    );

    (dataSource.initiateRequest as Mock).mockClear();

    update({
      request: { viewport: { start: START_2, end: END_2 } },
    });

    expect(dataSource.initiateRequest).toBeCalledWith(expect.any(Object), [
      {
        id: DATA_STREAM_INFO.id,
        resolution: DATA_STREAM_INFO.resolution,
        start: START_2,
        end: END_2,
      },
    ]);
  });

  it('requests already cached data if the default TTL has expired', async () => {
    const dataModule = new IotAppKitDataModule();
    const dataSource = createMockSiteWiseDataSource([DATA_STREAM]);
    dataModule.registerDataSource(dataSource);

    const END_1 = new Date();
    const START_1 = new Date(END_1.getTime() - HOUR_IN_MS);

    const dataStreamCallback = jest.fn();
    const { update } = dataModule.subscribeToDataStreams(
      {
        query: DATA_STREAM_QUERY,
        request: { viewport: { start: START_1, end: END_1 }, settings: { fetchFromStartToEnd: true } },
      },
      dataStreamCallback
    );

    (dataSource.initiateRequest as Mock).mockClear();

    jest.advanceTimersByTime(MINUTE_IN_MS);

    // Need to trigger a re-request, we should be able to just 'recieve' the updated value instead.
    // TODO: Remove this line after completing task 'non-live mode subscribers have non-expired data'
    update({ request: { viewport: { start: START_1, end: END_1 } } });

    expect(dataSource.initiateRequest).toBeCalledWith(expect.any(Object), [
      {
        id: DATA_STREAM_INFO.id,
        resolution: DATA_STREAM_INFO.resolution,
        // 1 minute time advancement invalidates 3 minutes of cache by default, which is 2 minutes from END_1
        start: new Date(END_1.getTime() - 2 * MINUTE_IN_MS),
        end: END_1,
      },
    ]);
  });

  it('requests already cached data if custom TTL has expired', async () => {
    const customCacheSettings = {
      ttlDurationMapping: {
        [MINUTE_IN_MS]: 0,
        [5 * MINUTE_IN_MS]: 30 * SECOND_IN_MS,
      },
    };

    const dataModule = new IotAppKitDataModule({ cacheSettings: customCacheSettings });
    const dataSource = createMockSiteWiseDataSource([DATA_STREAM]);
    dataModule.registerDataSource(dataSource);

    const END_1 = new Date();
    const START_1 = new Date(END_1.getTime() - HOUR_IN_MS);

    const dataStreamCallback = jest.fn();
    const { update } = dataModule.subscribeToDataStreams(
      {
        query: DATA_STREAM_QUERY,
        request: { viewport: { start: START_1, end: END_1 }, settings: { fetchFromStartToEnd: true } },
      },
      dataStreamCallback
    );

    (dataSource.initiateRequest as Mock).mockClear();
    jest.advanceTimersByTime(MINUTE_IN_MS);

    // Need to trigger a re-request, we should be able to just 'recieve' the updated value instead.
    // TODO: Remove this line after completing task 'non-live mode subscribers have non-expired data'
    update({ request: { viewport: { start: START_1, end: END_1 } } });

    expect(dataSource.initiateRequest).toBeCalledWith(expect.any(Object), [
      {
        id: DATA_STREAM_INFO.id,
        resolution: DATA_STREAM_INFO.resolution,
        // 1 minute time advancement invalidates 5 minutes of cache with custom mapping, which is 4 minutes from END_1
        start: new Date(END_1.getTime() - 4 * MINUTE_IN_MS),
        end: END_1,
      },
    ]);
  });
});

describe('request scheduler', () => {
  it('periodically requests duration based queries', async () => {
    const dataModule = new IotAppKitDataModule();
    const dataSource = createMockSiteWiseDataSource([DATA_STREAM]);
    dataModule.registerDataSource(dataSource);

    const dataStreamCallback = jest.fn();
    const { unsubscribe } = dataModule.subscribeToDataStreams(
      {
        query: DATA_STREAM_QUERY,
        request: {
          viewport: { duration: 900000 },
          settings: { fetchFromStartToEnd: true, refreshRate: SECOND_IN_MS * 0.1 },
        },
      },
      dataStreamCallback
    );

    dataStreamCallback.mockClear();
    await wait(SECOND_IN_MS * 0.11);

    expect(dataStreamCallback).toBeCalledTimes(2);

    dataStreamCallback.mockClear();
    await wait(SECOND_IN_MS * 0.11);

    expect(dataStreamCallback).toBeCalledTimes(2);
    unsubscribe();
  });

  it('stops requesting for data after unsubscribing', async () => {
    const dataModule = new IotAppKitDataModule();
    const dataSource = createMockSiteWiseDataSource([DATA_STREAM]);
    dataModule.registerDataSource(dataSource);

    const dataStreamCallback = jest.fn();
    const { unsubscribe } = dataModule.subscribeToDataStreams(
      {
        query: DATA_STREAM_QUERY,
        request: {
          viewport: { duration: SECOND_IN_MS },
          settings: {
            fetchFromStartToEnd: true,
            refreshRate: SECOND_IN_MS * 0.1,
          },
        },
      },
      dataStreamCallback
    );

    unsubscribe();
    await flushPromises();
    dataStreamCallback.mockClear();

    await wait(SECOND_IN_MS * 0.11);

    expect(dataStreamCallback).not.toHaveBeenCalled();
  });

  it('periodically requests data after switching from static to duration based viewport', async () => {
    const DATA_POINT: DataPoint<number> = { x: Date.now(), y: 1921 };
    const dataModule = new IotAppKitDataModule();
    const dataSource = createMockSiteWiseDataSource([{ ...DATA_STREAM, data: [DATA_POINT] }]);
    dataModule.registerDataSource(dataSource);

    const dataStreamCallback = jest.fn();
    const { update, unsubscribe } = dataModule.subscribeToDataStreams(
      {
        query: DATA_STREAM_QUERY,
        request: {
          viewport: { start: new Date(2000, 0, 0), end: new Date(2001, 0, 0) },
          settings: {
            fetchMostRecentBeforeEnd: true,
            refreshRate: SECOND_IN_MS * 0.1,
          },
        },
      },
      dataStreamCallback
    );

    update({
      request: {
        viewport: { duration: MINUTE_IN_MS },
        settings: {
          refreshRate: SECOND_IN_MS * 0.1,
          fetchFromStartToEnd: true,
        },
      },
    });
    dataStreamCallback.mockClear();

    await wait(SECOND_IN_MS * 0.11);
    expect(dataStreamCallback).toBeCalledTimes(2);
    dataStreamCallback.mockClear();

    await wait(SECOND_IN_MS * 0.11);
    expect(dataStreamCallback).toBeCalledTimes(2);

    unsubscribe();
  });

  it('stops the request scheduler when we first update request info to have duration and then call unsubscribe', async () => {
    const dataModule = new IotAppKitDataModule();
    const dataSource = createMockSiteWiseDataSource([DATA_STREAM]);
    dataModule.registerDataSource(dataSource);

    const dataStreamCallback = jest.fn();
    const { update, unsubscribe } = dataModule.subscribeToDataStreams(
      {
        query: DATA_STREAM_QUERY,
        request: {
          viewport: { start: new Date(2000, 0, 0), end: new Date(2001, 0, 0) },
          settings: {
            fetchFromStartToEnd: true,
            refreshRate: SECOND_IN_MS * 0.1,
          },
        },
      },
      dataStreamCallback
    );

    // Update the request info to trigger the live mode
    update({
      request: {
        viewport: { duration: SECOND_IN_MS },
        settings: {
          fetchFromStartToEnd: true,
          refreshRate: SECOND_IN_MS * 0.1,
        },
      },
    });

    unsubscribe();
    dataStreamCallback.mockClear();

    await wait(SECOND_IN_MS * 0.11);
    expect(dataStreamCallback).not.toHaveBeenCalled();
  });

  it('stops the request scheduler when request info gets updated with static viewport', async () => {
    const dataModule = new IotAppKitDataModule();
    const dataSource = createMockSiteWiseDataSource([DATA_STREAM]);
    dataModule.registerDataSource(dataSource);

    const dataStreamCallback = jest.fn();
    const { update } = dataModule.subscribeToDataStreams(
      {
        query: DATA_STREAM_QUERY,
        request: { viewport: { duration: SECOND_IN_MS }, settings: { fetchFromStartToEnd: true } },
      },
      dataStreamCallback
    );

    update({
      request: {
        viewport: { start: new Date(2000, 0, 0), end: new Date(2001, 0, 0) },
        settings: {
          refreshRate: SECOND_IN_MS * 0.1,
          fetchFromStartToEnd: true,
        },
      },
    });
    dataStreamCallback.mockClear();

    await wait(SECOND_IN_MS * 0.11);

    expect(dataStreamCallback).not.toBeCalled();
  });
});

it('when data is requested from the viewport start to end with a buffer, include a buffer', () => {
  const dataModule = new IotAppKitDataModule();
  const dataSource = createMockSiteWiseDataSource([DATA_STREAM]);
  dataModule.registerDataSource(dataSource);

  const dataStreamCallback = jest.fn();
  const start = new Date(2021, 5, 20, 1, 30);
  const end = new Date(2021, 5, 20, 1, 50);
  const expectedStart = new Date(2021, 5, 20, 1, 13, 45);
  const expectedEnd = new Date(2021, 5, 20, 2, 3, 45);
  const requestBuffer = 0.5;

  const { unsubscribe } = dataModule.subscribeToDataStreams(
    {
      query: DATA_STREAM_QUERY,
      request: { viewport: { start, end }, settings: { requestBuffer, fetchFromStartToEnd: true } },
    },
    dataStreamCallback
  );

  expect(dataSource.initiateRequest).toBeCalledWith(
    expect.objectContaining({
      request: expect.objectContaining({
        settings: expect.objectContaining({
          requestBuffer,
        }),
      }),
    }),
    expect.arrayContaining([
      expect.objectContaining({
        start: expectedStart,
        end: expectedEnd,
      }),
    ])
  );

  unsubscribe();
});
