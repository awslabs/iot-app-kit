import flushPromises from 'flush-promises';
import { DATA_STREAM, DATA_STREAM_INFO, DATA_STREAM_2 } from '../mockWidgetProperties';
import { createMockSiteWiseDataSource } from '../__mocks__';
import { DataSource, DataStreamQuery, DataStream, SiteWiseDataStreamQuery } from './types';
import { DataPoint } from '@synchro-charts/core';
import { TimeSeriesDataRequest, TimeSeriesDataRequestSettings } from './data-cache/requestTypes';
import { DataStreamsStore, DataStreamStore } from './data-cache/types';
import * as caching from './data-cache/caching/caching';
import { HOUR_IN_MS, MINUTE_IN_MS, MONTH_IN_MS, SECOND_IN_MS } from '../common/time';
import { IotAppKitDataModule } from './IotAppKitDataModule';

import { toSiteWiseAssetProperty, toDataStreamId } from '../common/dataStreamId';
import Mock = jest.Mock;

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

const CUSTOM_DATA_SOURCE = 'custom-source';

type CustomDataStreamQuery = DataStreamQuery & {
  assets: [
    {
      id: string;
    }
  ];
};

const createCustomMockDataSource = (dataStreams: DataStream[]): DataSource<CustomDataStreamQuery> => ({
  name: CUSTOM_DATA_SOURCE,
  initiateRequest: jest.fn(({ onSuccess }: any) => onSuccess(dataStreams)),
  getRequestsFromQuery: ({ query }) => query.assets.map(({ id }) => ({ id, resolution: '0' })),
});

beforeAll(() => {
  jest.useFakeTimers('modern');
});

afterAll(() => {
  jest.useRealTimers();
});

it('subscribes to an empty set of queries', async () => {
  const dataModule = new IotAppKitDataModule();
  const dataSource = createMockSiteWiseDataSource({ dataStreams: [] });
  dataModule.registerDataSource(dataSource);

  const onSuccess = jest.fn();
  dataModule.subscribeToDataStreams(
    {
      queries: [{ source: dataSource.name, assets: [] } as SiteWiseDataStreamQuery],
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
    const dataSource = createMockSiteWiseDataSource({ dataStreams: [DATA_STREAM] });

    dataModule.registerDataSource(dataSource);

    const timeSeriesCallback = jest.fn();

    const queries: SiteWiseDataStreamQuery[] = [{ source: dataSource.name, assets: [] }];

    const { update } = dataModule.subscribeToDataStreams(
      {
        queries,
        request: {
          viewport: { start: new Date(2000, 0, 0), end: new Date(2001, 0, 0) },
          settings: {
            fetchFromStartToEnd: true,
          },
        },
      },
      timeSeriesCallback
    );

    timeSeriesCallback.mockClear();
    (dataSource.initiateRequest as Mock).mockClear();

    update({ queries: [DATA_STREAM_QUERY] });

    await flushPromises();
    jest.advanceTimersByTime(SECOND_IN_MS);

    // expect(timeSeriesCallback).toHaveBeenLastCalledWith([expect.objectContaining({ id: DATA_STREAM.id })]);
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

    const timeSeriesCallback = jest.fn();

    dataModule.subscribeToDataStreams(
      {
        queries: [{ source: dataSource.name }],
        request: {
          viewport: { start: new Date(2000, 0, 0), end: new Date(2001, 0, 0) },
          settings: {
            fetchFromStartToEnd: true,
          },
        },
      },
      timeSeriesCallback
    );

    expect(timeSeriesCallback).not.toBeCalled();
    expect(dataSource.initiateRequest).not.toBeCalled();
  });

  it('passes back associated refId', () => {
    const REF_ID = 'ref-id';
    const query: SiteWiseDataStreamQuery = {
      source: 'site-wise',
      assets: [
        {
          assetId: ASSET_ID,
          properties: [{ propertyId: PROPERTY_ID, refId: REF_ID }],
        },
      ],
    };

    const START = new Date(2000, 0, 0);
    const END = new Date();

    const dataModule = new IotAppKitDataModule();
    const dataSource: DataSource = {
      ...createMockSiteWiseDataSource({ dataStreams: [DATA_STREAM] }),
      initiateRequest: jest.fn(),
    };

    dataModule.registerDataSource(dataSource);

    const timeSeriesCallback = jest.fn();

    dataModule.subscribeToDataStreams(
      {
        queries: [query],
        request: { viewport: { start: START, end: END }, settings: { fetchFromStartToEnd: true } },
      },
      timeSeriesCallback
    );
    expect(timeSeriesCallback).toBeCalledWith({
      dataStreams: [
        expect.objectContaining({
          id: DATA_STREAM.id,
          refId: REF_ID,
        }),
      ],
      viewport: {
        start: START,
        end: END,
      },
    });
  });

  it('initiates a request for a data stream', () => {
    const START = new Date(2000, 0, 0);
    const END = new Date();

    const dataModule = new IotAppKitDataModule();
    const dataSource: DataSource = {
      ...createMockSiteWiseDataSource({ dataStreams: [DATA_STREAM] }),
      initiateRequest: jest.fn(),
    };

    dataModule.registerDataSource(dataSource);

    const timeSeriesCallback = jest.fn();

    dataModule.subscribeToDataStreams(
      {
        queries: [DATA_STREAM_QUERY],
        request: { viewport: { start: START, end: END }, settings: { fetchFromStartToEnd: true } },
      },
      timeSeriesCallback
    );

    expect(timeSeriesCallback).toBeCalledWith({
      dataStreams: [
        expect.objectContaining({
          id: DATA_STREAM.id,
          isLoading: true,
        } as DataStreamStore),
      ],
      viewport: {
        start: START,
        end: END,
      },
    });

    expect(dataSource.initiateRequest).toBeCalledWith(
      expect.objectContaining({
        query: DATA_STREAM_QUERY,
        request: { viewport: { start: START, end: END }, settings: { fetchFromStartToEnd: true } },
      }),
      [
        expect.objectContaining({
          id: DATA_STREAM.id,
          resolution: DATA_STREAM.resolution.toString(),
          start: START,
          end: END,
        }),
      ]
    );
  });
});

it('subscribes to a single data stream', async () => {
  const dataModule = new IotAppKitDataModule();
  const dataSource = createMockSiteWiseDataSource({ dataStreams: [DATA_STREAM] });
  dataModule.registerDataSource(dataSource);
  const { propertyId, assetId } = toSiteWiseAssetProperty(DATA_STREAM.id);

  const START = new Date(2000, 0, 0);
  const END = new Date(2001, 0, 0);

  const timeSeriesCallback = jest.fn();
  dataModule.subscribeToDataStreams(
    {
      queries: [
        {
          source: 'site-wise',
          assets: [
            {
              assetId,
              properties: [{ propertyId }],
            },
          ],
        },
      ],
      request: {
        viewport: { start: START, end: END },
        settings: { fetchFromStartToEnd: true },
      },
    },
    timeSeriesCallback
  );

  jest.advanceTimersByTime(1);

  expect(timeSeriesCallback).toBeCalledWith({
    dataStreams: [
      expect.objectContaining({
        id: DATA_STREAM.id,
        resolution: DATA_STREAM.resolution,
      }),
    ],
    viewport: {
      start: START,
      end: END,
    },
  });
});

it('throws error when subscribing to a non-existent data source', () => {
  const dataModule = new IotAppKitDataModule();
  expect(() =>
    dataModule.subscribeToDataStreams(
      {
        queries: [{ source: 'fake-source', assets: [] } as SiteWiseDataStreamQuery],
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
  const customSource = createMockSiteWiseDataSource({ dataStreams: [DATA_STREAM] });
  const { propertyId, assetId } = toSiteWiseAssetProperty(DATA_STREAM.id);

  const dataModule = new IotAppKitDataModule();
  const onSuccess = jest.fn();

  dataModule.registerDataSource(customSource);

  const START = new Date(2000, 0, 0);
  const END = new Date(2001, 0, 0);

  dataModule.subscribeToDataStreams(
    {
      queries: [
        {
          assets: [{ assetId, properties: [{ propertyId }] }],
          source: customSource.name,
        } as SiteWiseDataStreamQuery,
      ],
      request: {
        viewport: { start: START, end: END },
        settings: {
          fetchFromStartToEnd: true,
        },
      },
    },
    onSuccess
  );

  expect(onSuccess).toBeCalledWith({
    dataStreams: [expect.objectContaining({ id: DATA_STREAM.id })],
    viewport: {
      start: START,
      end: END,
    },
  });
});

it('subscribes to multiple data streams', () => {
  const onRequestData = jest.fn();
  const source = createMockSiteWiseDataSource({ onRequestData });

  const request: TimeSeriesDataRequest = {
    viewport: { start: new Date(1999, 0, 0), end: new Date() },
    settings: {
      fetchFromStartToEnd: true,
    },
  };

  const assets = [
    {
      assetId: 'asset-1',
      properties: [{ propertyId: 'prop-1' }, { propertyId: 'prop2' }],
    },
  ];

  const dataModule = new IotAppKitDataModule();
  const onSuccess = jest.fn();

  dataModule.registerDataSource(source);

  const query = {
    source: source.name,
    assets,
  };
  dataModule.subscribeToDataStreams(
    {
      queries: [query],
      request,
    },
    onSuccess
  );

  expect(onRequestData).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({
      assetId: assets[0].assetId,
      propertyId: assets[0].properties[0].propertyId,
    })
  );
  expect(onRequestData).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({
      assetId: assets[0].assetId,
      propertyId: assets[0].properties[1].propertyId,
    })
  );
});

it('subscribes to multiple queries on the same data source', () => {
  const onRequestData = jest.fn();
  const source = createMockSiteWiseDataSource({ onRequestData });

  const START = new Date(2000, 0, 0);
  const END = new Date(2001, 0, 0);

  const request: TimeSeriesDataRequest = {
    viewport: { start: START, end: END },
    settings: { fetchFromStartToEnd: true },
  };

  const dataModule = new IotAppKitDataModule();
  const onSuccess = jest.fn();

  dataModule.registerDataSource(source);

  const queries = [
    {
      source: source.name,
      assets: [
        {
          assetId: 'asset-1',
          properties: [{ propertyId: 'prop-1' }],
        },
      ],
    },
    {
      source: source.name,
      assets: [
        {
          assetId: 'asset-2',
          properties: [{ propertyId: 'prop-2' }],
        },
      ],
    },
  ];
  dataModule.subscribeToDataStreams(
    {
      queries,
      request,
    },
    onSuccess
  );

  expect(onRequestData).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({
      assetId: queries[0].assets[0].assetId,
      propertyId: queries[0].assets[0].properties[0].propertyId,
    })
  );
  expect(onRequestData).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({
      assetId: queries[1].assets[0].assetId,
      propertyId: queries[1].assets[0].properties[0].propertyId,
    })
  );

  expect(onSuccess).toBeCalledWith({
    dataStreams: [
      expect.objectContaining({
        id: toDataStreamId({
          assetId: queries[0].assets[0].assetId,
          propertyId: queries[0].assets[0].properties[0].propertyId,
        }),
      }),
      expect.objectContaining({
        id: toDataStreamId({
          assetId: queries[1].assets[0].assetId,
          propertyId: queries[1].assets[0].properties[0].propertyId,
        }),
      }),
    ],
    viewport: {
      start: START,
      end: END,
    },
  });
});

it.skip('subscribes to multiple data sources', () => {
  const source = createMockSiteWiseDataSource({ dataStreams: [DATA_STREAM_2] });
  const customSource = createCustomMockDataSource([DATA_STREAM as any]);

  const START = new Date(2000, 0, 0);
  const END = new Date(2001, 0, 0);

  const request: TimeSeriesDataRequest = {
    viewport: { start: START, end: END },
  };

  const dataModule = new IotAppKitDataModule();
  const onSuccess = jest.fn();

  dataModule.registerDataSource(source);
  dataModule.registerDataSource(customSource);

  const customSourceAssetId = `custom-id`;

  const queries = [
    {
      source: source.name,
      assets: [
        {
          assetId: 'some-asset-id-2',
          properties: [{ propertyId: 'some-property-id-2' }],
        },
      ],
    },
    {
      source: customSource.name,
      assets: [{ id: customSourceAssetId }],
    },
  ];
  dataModule.subscribeToDataStreams(
    {
      queries,
      request,
    },
    onSuccess
  );

  expect(onSuccess).toBeCalledWith({
    dataStreams: [
      expect.objectContaining({ id: DATA_STREAM_2.id }),
      expect.objectContaining({ id: customSourceAssetId }),
    ],
    viewport: {
      start: START,
      end: END,
    },
  });
});

it('subscribes to multiple data streams on multiple data sources', () => {
  const source = createMockSiteWiseDataSource({ dataStreams: [DATA_STREAM_2, DATA_STREAM] });
  const customSource = createCustomMockDataSource([]);

  const START = new Date(2000, 0, 0);
  const END = new Date(2001, 0, 0);

  const request: TimeSeriesDataRequest = {
    viewport: { start: START, end: END },
    settings: { fetchFromStartToEnd: true },
  };

  const dataModule = new IotAppKitDataModule();
  const onSuccess = jest.fn();

  dataModule.registerDataSource(source);
  dataModule.registerDataSource(customSource);

  const customSourceAssetId_1 = `custom-id-1`;
  const customSourceAssetId_2 = 'custom-id-2';

  const queries = [
    {
      source: source.name,
      assets: [
        {
          assetId: 'some-asset-id-2',
          properties: [{ propertyId: 'some-property-id-2' }],
        },
        {
          assetId: 'some-asset-id',
          properties: [{ propertyId: 'some-property-id' }],
        },
      ],
    },
    {
      source: customSource.name,
      assets: [{ id: customSourceAssetId_1 }, { id: customSourceAssetId_2 }],
    },
  ];
  dataModule.subscribeToDataStreams(
    {
      queries,
      request,
    },
    onSuccess
  );

  expect(onSuccess).toBeCalledWith({
    dataStreams: [
      expect.objectContaining({ id: DATA_STREAM_2.id }),
      expect.objectContaining({ id: DATA_STREAM.id }),
      expect.objectContaining({ id: customSourceAssetId_1 }),
      expect.objectContaining({ id: customSourceAssetId_2 }),
    ],
    viewport: {
      start: START,
      end: END,
    },
  });
});

it('only requests latest value', () => {
  const onRequestData = jest.fn();
  const source = createMockSiteWiseDataSource({ onRequestData });

  const LATEST_VALUE_REQUEST_SETTINGS: TimeSeriesDataRequestSettings = { fetchMostRecentBeforeEnd: true };

  const dataModule = new IotAppKitDataModule();
  const onSuccess = jest.fn();

  dataModule.registerDataSource(source);

  dataModule.subscribeToDataStreams(
    {
      queries: [
        {
          source: source.name,
          assets: [
            {
              assetId: 'asset-1',
              properties: [{ propertyId: 'prop-1' }],
            },
          ],
        },
      ],
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
  const ERR = { msg: 'An error has occurred!', type: 'ResourceNotFoundException', status: '404' };

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
        error: ERR,
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
    const customSource = createMockSiteWiseDataSource({ dataStreams: [DATA_STREAM] });

    const dataModule = new IotAppKitDataModule({ initialDataCache: CACHE_WITH_ERROR });
    const timeSeriesCallback = jest.fn();

    dataModule.registerDataSource(customSource);

    const START = new Date(2000, 0, 0);
    const END = new Date();

    dataModule.subscribeToDataStreams(
      {
        queries: [DATA_STREAM_QUERY],
        request: {
          viewport: { start: START, end: END },
          settings: { fetchFromStartToEnd: true },
        },
      },
      timeSeriesCallback
    );

    expect(timeSeriesCallback).toBeCalledTimes(1);
    expect(timeSeriesCallback).toBeCalledWith({
      dataStreams: [expect.objectContaining({ error: ERR })],
      viewport: {
        start: START,
        end: END,
      },
    });
  });

  it('does not re-request a data stream with an error associated with it', async () => {
    const customSource = createMockSiteWiseDataSource({ dataStreams: [DATA_STREAM] });

    const dataModule = new IotAppKitDataModule({ initialDataCache: CACHE_WITH_ERROR });
    const timeSeriesCallback = jest.fn();

    dataModule.registerDataSource(customSource);

    dataModule.subscribeToDataStreams(
      {
        queries: [DATA_STREAM_QUERY],
        request: {
          viewport: { duration: 900000 },
          settings: {
            refreshRate: SECOND_IN_MS / 10,
            fetchFromStartToEnd: true,
          },
        },
      },
      timeSeriesCallback
    );

    timeSeriesCallback.mockClear();
    jest.advanceTimersByTime(SECOND_IN_MS * 0.11);
    expect(timeSeriesCallback).not.toBeCalled();
  });

  it('does request a data stream which has no error associated with it', () => {
    const customSource = createMockSiteWiseDataSource({ dataStreams: [DATA_STREAM] });

    const dataModule = new IotAppKitDataModule({ initialDataCache: CACHE_WITHOUT_ERROR });

    const timeSeriesCallback = jest.fn();

    dataModule.registerDataSource(customSource);

    const START = new Date(2000, 0, 0);
    const END = new Date();

    dataModule.subscribeToDataStreams(
      {
        queries: [DATA_STREAM_QUERY],
        request: {
          viewport: { start: START, end: END },
          settings: { fetchFromStartToEnd: true },
        },
      },
      timeSeriesCallback
    );

    expect(timeSeriesCallback).toBeCalledTimes(1);
    expect(timeSeriesCallback).toBeCalledWith({
      dataStreams: [expect.objectContaining({ error: undefined })],
      viewport: {
        start: START,
        end: END,
      },
    });
  });
});

describe('caching', () => {
  it('does not request already cached data', () => {
    const dataModule = new IotAppKitDataModule();
    const dataSource = createMockSiteWiseDataSource({ dataStreams: [DATA_STREAM] });
    dataModule.registerDataSource(dataSource);

    const START_1 = new Date(2000, 1, 0);
    const END_1 = new Date(2000, 2, 0);

    const START_2 = new Date(2001, 1, 0);
    const END_2 = new Date(2001, 2, 0);

    const timeSeriesCallback = jest.fn();
    const { update } = dataModule.subscribeToDataStreams(
      {
        queries: [DATA_STREAM_QUERY],
        request: { viewport: { start: START_1, end: END_1 }, settings: { fetchFromStartToEnd: true } },
      },
      timeSeriesCallback
    );

    update({ request: { viewport: { start: START_2, end: END_2 }, settings: { fetchFromStartToEnd: true } } });

    (dataSource.initiateRequest as Mock).mockClear();

    update({ request: { viewport: { start: START_1, end: END_1 }, settings: { fetchFromStartToEnd: true } } });
    expect(dataSource.initiateRequest).not.toBeCalled();
  });

  it('requests only uncached data', async () => {
    const dataModule = new IotAppKitDataModule();
    const dataSource = createMockSiteWiseDataSource({ dataStreams: [DATA_STREAM] });
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

    const timeSeriesCallback = jest.fn();
    const { update } = dataModule.subscribeToDataStreams(
      {
        queries: [DATA_STREAM_QUERY],
        request: { viewport: { start: START_1, end: END_1 }, settings: { fetchFromStartToEnd: true } },
      },
      timeSeriesCallback
    );

    expect(dataSource.initiateRequest).toHaveBeenCalledTimes(1);

    expect(dataSource.initiateRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        query: DATA_STREAM_QUERY,
        request: { viewport: { start: START_1, end: END_1 }, settings: { fetchFromStartToEnd: true } },
      }),
      [
        expect.objectContaining({
          id: DATA_STREAM.id,
          resolution: DATA_STREAM.resolution.toString(),
          start: START_1,
          end: END_1,
        }),
      ]
    );

    (dataSource.initiateRequest as Mock).mockClear();

    update({ request: { viewport: { start: START_2, end: END_2 }, settings: { fetchFromStartToEnd: true } } });

    await flushPromises();

    expect(dataSource.initiateRequest).toHaveBeenCalledTimes(1);

    expect(dataSource.initiateRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        query: DATA_STREAM_QUERY,
        request: { viewport: { start: START_2, end: END_2 }, settings: { fetchFromStartToEnd: true } },
      }),
      [
        expect.objectContaining({
          id: DATA_STREAM.id,
          resolution: DATA_STREAM.resolution.toString(),
          start: START_2,
          end: START_1,
        }),
        expect.objectContaining({
          id: DATA_STREAM.id,
          resolution: DATA_STREAM.resolution.toString(),
          start: END_1,
          end: END_2,
        }),
      ]
    );
  });

  it('immediately request when subscribed to an entirely new time interval not previously requested', () => {
    const dataModule = new IotAppKitDataModule();
    const dataSource = createMockSiteWiseDataSource({ dataStreams: [DATA_STREAM] });
    dataModule.registerDataSource(dataSource);

    const START_1 = new Date(2000, 1, 0);
    const END_1 = new Date(2000, 2, 0);
    const START_2 = new Date(1991, 0, 0);
    const END_2 = new Date(1999, 1, 0);

    const timeSeriesCallback = jest.fn();
    const { update } = dataModule.subscribeToDataStreams(
      {
        queries: [DATA_STREAM_QUERY],
        request: {
          viewport: { start: START_1, end: END_1 },
          settings: { fetchFromStartToEnd: true, requestBuffer: 0 },
        },
      },
      timeSeriesCallback
    );

    (dataSource.initiateRequest as Mock).mockClear();

    update({
      request: { viewport: { start: START_2, end: END_2 }, settings: { fetchFromStartToEnd: true } },
    });

    expect(dataSource.initiateRequest).toBeCalledWith(
      expect.objectContaining({
        query: DATA_STREAM_QUERY,
        request: { viewport: { start: START_2, end: END_2 }, settings: { fetchFromStartToEnd: true } },
      }),
      [
        expect.objectContaining({
          id: DATA_STREAM_INFO.id,
          resolution: DATA_STREAM_INFO.resolution.toString(),
          start: START_2,
          end: END_2,
        }),
      ]
    );
  });

  it('requests already cached data if the default TTL has expired', async () => {
    const dataModule = new IotAppKitDataModule();
    const dataSource = createMockSiteWiseDataSource({ dataStreams: [DATA_STREAM] });
    dataModule.registerDataSource(dataSource);

    const END = new Date();
    const START = new Date(END.getTime() - HOUR_IN_MS);

    const timeSeriesCallback = jest.fn();
    dataModule.subscribeToDataStreams(
      {
        queries: [DATA_STREAM_QUERY],
        request: {
          viewport: { start: START, end: END },
          settings: { fetchFromStartToEnd: true, refreshRate: MINUTE_IN_MS, requestBuffer: 0 },
        },
      },
      timeSeriesCallback
    );

    (dataSource.initiateRequest as Mock).mockClear();

    jest.advanceTimersByTime(MINUTE_IN_MS);

    expect(dataSource.initiateRequest).toBeCalledWith(
      expect.objectContaining({
        query: DATA_STREAM_QUERY,
        request: {
          // 1 minute time advancement invalidates 3 minutes of cache by default, which is 2 minutes from END_1
          viewport: { start: START, end: END },
          settings: { fetchFromStartToEnd: true, refreshRate: MINUTE_IN_MS, requestBuffer: 0 },
        },
      }),
      [
        expect.objectContaining({
          id: DATA_STREAM_INFO.id,
          resolution: DATA_STREAM_INFO.resolution.toString(),
          // 1 minute time advancement invalidates 3 minutes of cache by default, which is 2 minutes from END_1
          start: new Date(END.getTime() - 2 * MINUTE_IN_MS),
          end: END,
        }),
      ]
    );
  });

  it.skip('requests already cached data if custom TTL has expired', async () => {
    const customCacheSettings = {
      ttlDurationMapping: {
        [MINUTE_IN_MS]: 0,
        [5 * MINUTE_IN_MS]: 30 * SECOND_IN_MS,
      },
    };

    const dataModule = new IotAppKitDataModule({ cacheSettings: customCacheSettings });
    const dataSource = createMockSiteWiseDataSource({ dataStreams: [DATA_STREAM] });
    dataModule.registerDataSource(dataSource);

    const END = new Date();
    const START = new Date(END.getTime() - HOUR_IN_MS);

    const timeSeriesCallback = jest.fn();
    dataModule.subscribeToDataStreams(
      {
        queries: [DATA_STREAM_QUERY],
        request: { viewport: { start: START, end: END }, settings: { refreshRate: MINUTE_IN_MS, requestBuffer: 0 } },
      },
      timeSeriesCallback
    );

    (dataSource.initiateRequest as Mock).mockClear();
    jest.advanceTimersByTime(MINUTE_IN_MS);

    expect(dataSource.initiateRequest).toBeCalledWith(
      expect.objectContaining({
        query: DATA_STREAM_QUERY,
        // 1 minute time advancement invalidates 5 minutes of cache with custom mapping, which is 4 minutes from END_1
        request: {
          viewport: { start: START, end: END },
          settings: { refreshRate: MINUTE_IN_MS, requestBuffer: 0 },
        },
      }),
      [
        {
          id: DATA_STREAM_INFO.id,
          resolution: DATA_STREAM_INFO.resolution.toString(),
          start: new Date(END.getTime() - 4 * MINUTE_IN_MS),
          end: END,
        },
      ]
    );
  });
});

it.skip('overrides module-level cache TTL if query-level cache TTL is provided', async () => {
  const customCacheSettings = {
    ttlDurationMapping: {
      [MINUTE_IN_MS]: 0,
      [5 * MINUTE_IN_MS]: 30 * SECOND_IN_MS,
    },
  };

  const dataModule = new IotAppKitDataModule({ cacheSettings: customCacheSettings });
  const dataSource = createMockSiteWiseDataSource({ dataStreams: [DATA_STREAM] });
  dataModule.registerDataSource(dataSource);

  const END = new Date();
  const START = new Date(END.getTime() - HOUR_IN_MS);

  const timeSeriesCallback = jest.fn();
  dataModule.subscribeToDataStreams(
    {
      queries: [
        {
          ...DATA_STREAM_QUERY,
          cacheSettings: {
            ttlDurationMapping: {
              [MINUTE_IN_MS]: 0,
              [10 * MINUTE_IN_MS]: 30 * SECOND_IN_MS,
            },
          },
        },
      ],
      request: { viewport: { start: START, end: END }, settings: { refreshRate: MINUTE_IN_MS, requestBuffer: 0 } },
    },
    timeSeriesCallback
  );

  (dataSource.initiateRequest as Mock).mockClear();
  jest.advanceTimersByTime(MINUTE_IN_MS);

  expect(dataSource.initiateRequest).toBeCalledWith(
    expect.objectContaining({
      query: {
        ...DATA_STREAM_QUERY,
        cacheSettings: {
          ttlDurationMapping: {
            [MINUTE_IN_MS]: 0,
            [10 * MINUTE_IN_MS]: 30 * SECOND_IN_MS,
          },
        },
      },
      // 1 minute time advancement invalidates 10 minutes of cache with query-level mapping, which is 9 minutes from END_1
      request: {
        viewport: { start: START, end: END },
        settings: { refreshRate: MINUTE_IN_MS, requestBuffer: 0 },
      },
    }),
    [
      {
        id: DATA_STREAM_INFO.id,
        resolution: DATA_STREAM_INFO.resolution.toString(),
        start: new Date(END.getTime() - 9 * MINUTE_IN_MS),
        end: END,
      },
    ]
  );
});

describe('request scheduler', () => {
  it('periodically requests duration based queries', async () => {
    const dataModule = new IotAppKitDataModule();
    const dataSource = createMockSiteWiseDataSource({ dataStreams: [DATA_STREAM] });
    dataModule.registerDataSource(dataSource);

    const timeSeriesCallback = jest.fn();
    const { unsubscribe } = dataModule.subscribeToDataStreams(
      {
        queries: [DATA_STREAM_QUERY],
        request: {
          viewport: { duration: 900000 },
          settings: { fetchFromStartToEnd: true, refreshRate: SECOND_IN_MS * 0.1 },
        },
      },
      timeSeriesCallback
    );

    timeSeriesCallback.mockClear();
    jest.advanceTimersByTime(SECOND_IN_MS * 0.11);

    expect(timeSeriesCallback).toBeCalledTimes(2);

    timeSeriesCallback.mockClear();
    jest.advanceTimersByTime(SECOND_IN_MS * 0.11);

    expect(timeSeriesCallback).toBeCalledTimes(2);
    unsubscribe();
  });

  it('periodically requests static viewport queries until TTL rules no longer apply', async () => {
    const customCacheSettings = {
      ttlDurationMapping: {
        [MINUTE_IN_MS]: 0,
      },
    };

    const dataModule = new IotAppKitDataModule({ cacheSettings: customCacheSettings });
    const dataSource = createMockSiteWiseDataSource({ dataStreams: [DATA_STREAM] });
    dataModule.registerDataSource(dataSource);

    const END = new Date();
    const START = new Date(END.getTime() - HOUR_IN_MS);

    const timeSeriesCallback = jest.fn();
    const { unsubscribe } = dataModule.subscribeToDataStreams(
      {
        queries: [DATA_STREAM_QUERY],
        request: {
          viewport: { start: START, end: END },
          settings: { fetchFromStartToEnd: true, refreshRate: SECOND_IN_MS * 0.1 },
        },
      },
      timeSeriesCallback
    );

    timeSeriesCallback.mockClear();
    jest.advanceTimersByTime(SECOND_IN_MS * 0.11);

    expect(timeSeriesCallback).toBeCalledTimes(2);

    timeSeriesCallback.mockClear();
    jest.advanceTimersByTime(SECOND_IN_MS * 0.11);

    expect(timeSeriesCallback).toBeCalledTimes(2);

    // advance until TTL rules no longer apply (data no longer expireable)
    jest.advanceTimersByTime(MINUTE_IN_MS);

    timeSeriesCallback.mockClear();
    jest.advanceTimersByTime(SECOND_IN_MS * 0.11);

    expect(timeSeriesCallback).toBeCalledTimes(0);

    unsubscribe();
  });

  it('stops requesting for data after unsubscribing', async () => {
    const dataModule = new IotAppKitDataModule();
    const dataSource = createMockSiteWiseDataSource({ dataStreams: [DATA_STREAM] });
    dataModule.registerDataSource(dataSource);

    const timeSeriesCallback = jest.fn();
    const { unsubscribe } = dataModule.subscribeToDataStreams(
      {
        queries: [DATA_STREAM_QUERY],
        request: {
          viewport: { duration: SECOND_IN_MS },
          settings: {
            fetchFromStartToEnd: true,
            refreshRate: SECOND_IN_MS * 0.1,
          },
        },
      },
      timeSeriesCallback
    );

    unsubscribe();
    await flushPromises();
    timeSeriesCallback.mockClear();

    jest.advanceTimersByTime(SECOND_IN_MS * 0.11);

    expect(timeSeriesCallback).not.toHaveBeenCalled();
  });

  it('periodically requests data after switching from static to duration based viewport', async () => {
    const DATA_POINT: DataPoint<number> = { x: Date.now(), y: 1921 };
    const dataModule = new IotAppKitDataModule();
    const dataSource = createMockSiteWiseDataSource({ dataStreams: [{ ...DATA_STREAM, data: [DATA_POINT] }] });
    dataModule.registerDataSource(dataSource);

    const timeSeriesCallback = jest.fn();
    const { update, unsubscribe } = dataModule.subscribeToDataStreams(
      {
        queries: [DATA_STREAM_QUERY],
        request: {
          viewport: { start: new Date(2000, 0, 0), end: new Date(2001, 0, 0) },
          settings: {
            fetchMostRecentBeforeEnd: true,
            refreshRate: SECOND_IN_MS * 0.1,
          },
        },
      },
      timeSeriesCallback
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
    timeSeriesCallback.mockClear();

    jest.advanceTimersByTime(SECOND_IN_MS * 0.11);
    expect(timeSeriesCallback).toBeCalledTimes(2);
    timeSeriesCallback.mockClear();

    jest.advanceTimersByTime(SECOND_IN_MS * 0.11);
    expect(timeSeriesCallback).toBeCalledTimes(2);

    unsubscribe();
  });

  it('stops the request scheduler when we first update request info to have duration and then call unsubscribe', async () => {
    const dataModule = new IotAppKitDataModule();
    const dataSource = createMockSiteWiseDataSource({ dataStreams: [DATA_STREAM] });
    dataModule.registerDataSource(dataSource);

    const timeSeriesCallback = jest.fn();
    const { update, unsubscribe } = dataModule.subscribeToDataStreams(
      {
        queries: [DATA_STREAM_QUERY],
        request: {
          viewport: { start: new Date(2000, 0, 0), end: new Date(2001, 0, 0) },
          settings: {
            fetchFromStartToEnd: true,
            refreshRate: SECOND_IN_MS * 0.1,
          },
        },
      },
      timeSeriesCallback
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
    timeSeriesCallback.mockClear();

    jest.advanceTimersByTime(SECOND_IN_MS * 0.11);
    expect(timeSeriesCallback).not.toHaveBeenCalled();
  });

  it('stops the request scheduler when request info gets updated with static viewport that does not intersect with any TTL intervals', async () => {
    const dataModule = new IotAppKitDataModule();
    const dataSource = createMockSiteWiseDataSource({ dataStreams: [DATA_STREAM] });
    dataModule.registerDataSource(dataSource);

    const timeSeriesCallback = jest.fn();
    const { update } = dataModule.subscribeToDataStreams(
      {
        queries: [DATA_STREAM_QUERY],
        request: { viewport: { duration: SECOND_IN_MS }, settings: { fetchFromStartToEnd: true } },
      },
      timeSeriesCallback
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
    timeSeriesCallback.mockClear();

    jest.advanceTimersByTime(SECOND_IN_MS * 0.11);

    expect(timeSeriesCallback).not.toBeCalled();
  });

  it('continues the schedule requests when request info gets updated with static viewport that intersects with TTL intervals', async () => {
    const dataModule = new IotAppKitDataModule();
    const dataSource = createMockSiteWiseDataSource({ dataStreams: [DATA_STREAM] });
    dataModule.registerDataSource(dataSource);

    const timeSeriesCallback = jest.fn();
    const { update } = dataModule.subscribeToDataStreams(
      {
        queries: [DATA_STREAM_QUERY],
        request: { viewport: { duration: SECOND_IN_MS }, settings: { fetchFromStartToEnd: true } },
      },
      timeSeriesCallback
    );

    const END = new Date();
    const START = new Date(END.getTime() - HOUR_IN_MS);

    update({
      request: {
        viewport: { start: START, end: END },
        settings: { refreshRate: SECOND_IN_MS * 0.1, fetchFromStartToEnd: true },
      },
    });
    timeSeriesCallback.mockClear();

    jest.advanceTimersByTime(SECOND_IN_MS * 0.11);

    expect(timeSeriesCallback).toBeCalledTimes(2);
  });
});

it('when data is requested from the viewport start to end with a buffer, include a buffer', () => {
  const dataModule = new IotAppKitDataModule();
  const dataSource = createMockSiteWiseDataSource({ dataStreams: [DATA_STREAM] });
  dataModule.registerDataSource(dataSource);

  const timeSeriesCallback = jest.fn();
  const start = new Date(2021, 5, 20, 1, 30);
  const end = new Date(2021, 5, 20, 1, 50);
  const expectedStart = new Date(2021, 5, 20, 1, 13, 45);
  const expectedEnd = new Date(2021, 5, 20, 2, 3, 45);
  const requestBuffer = 0.5;

  const { unsubscribe } = dataModule.subscribeToDataStreams(
    {
      queries: [DATA_STREAM_QUERY],
      request: { viewport: { start, end }, settings: { requestBuffer, fetchFromStartToEnd: true } },
    },
    timeSeriesCallback
  );

  expect(dataSource.initiateRequest).toBeCalledWith(
    expect.objectContaining({
      request: {
        settings: {
          requestBuffer,
          fetchFromStartToEnd: true,
        },
        viewport: {
          start,
          end,
        },
      },
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
