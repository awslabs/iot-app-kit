import flushPromises from 'flush-promises';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { createDataSource, SITEWISE_DATA_SOURCE } from './data-source';
import { MINUTE_IN_MS, HOUR_IN_MS, MONTH_IN_MS } from '../../common/time';
import { SiteWiseDataStreamQuery } from './types';
import {
  ASSET_PROPERTY_DOUBLE_VALUE,
  AGGREGATE_VALUES,
  ASSET_PROPERTY_VALUE_HISTORY,
} from '../__mocks__/assetPropertyValue';
import { createMockSiteWiseSDK } from '../__mocks__/iotsitewiseSDK';
import { toDataStreamId } from './util/dataStreamId';
import { IotAppKitDataModule } from '../../data-module/IotAppKitDataModule';
import { TimeSeriesDataRequest } from '../../data-module/data-cache/requestTypes';
import Mock = jest.Mock;

it('initializes', () => {
  expect(() => createDataSource(createMockSiteWiseSDK())).not.toThrowError();
});
const noop = () => {};

const LAST_MINUTE_REQUEST: TimeSeriesDataRequest = {
  viewport: {
    duration: MINUTE_IN_MS,
  },
  settings: {
    fetchMostRecentBeforeEnd: true,
  },
};

const HISTORICAL_REQUEST: TimeSeriesDataRequest = {
  viewport: {
    start: new Date(2010, 0, 0),
    end: new Date(2011, 0, 0),
  },
  settings: {
    fetchFromStartToEnd: true,
  },
};

describe('initiateRequest', () => {
  it('does not call SDK when query contains no assets', () => {
    const getAssetPropertyValue = jest.fn();
    const getAssetPropertyAggregates = jest.fn();
    const getAssetPropertyValueHistory = jest.fn();
    const getInterpolatedAssetPropertyValues = jest.fn();

    const mockSDK = createMockSiteWiseSDK({
      getAssetPropertyValue,
      getAssetPropertyValueHistory,
      getAssetPropertyAggregates,
      getInterpolatedAssetPropertyValues,
    });

    const dataSource = createDataSource(mockSDK as IoTSiteWiseClient);

    dataSource.initiateRequest(
      {
        onError: noop,
        onSuccess: noop,
        query: {
          source: SITEWISE_DATA_SOURCE,
          assets: [],
        },
        request: LAST_MINUTE_REQUEST,
      },
      []
    );

    expect(getAssetPropertyAggregates).not.toBeCalled();
    expect(getAssetPropertyValue).not.toBeCalled();
    expect(getAssetPropertyValueHistory).not.toBeCalled();
    expect(getInterpolatedAssetPropertyValues).not.toBeCalled();
  });

  describe('fetch latest before end', () => {
    describe('on error', () => {
      it('calls `onError` callback', async () => {
        const ERR_MESSAGE = 'some critical error! page oncall immediately';
        const getAssetPropertyValue = jest.fn().mockRejectedValue(new Error(ERR_MESSAGE));

        const mockSDK = createMockSiteWiseSDK({ getAssetPropertyValue });

        const dataSource = createDataSource(mockSDK);

        const ASSET_1 = 'asset-1';
        const PROPERTY_1 = 'prop-1';

        const query: SiteWiseDataStreamQuery = {
          source: SITEWISE_DATA_SOURCE,
          assets: [{ assetId: ASSET_1, properties: [{ propertyId: PROPERTY_1 }] }],
        };

        const onError = jest.fn();
        const onSuccess = jest.fn();

        dataSource.initiateRequest(
          {
            onError,
            onSuccess,
            query,
            request: LAST_MINUTE_REQUEST,
          },
          [
            {
              id: toDataStreamId({ assetId: ASSET_1, propertyId: PROPERTY_1 }),
              start: new Date(),
              end: new Date(),
              resolution: 0,
            },
          ]
        );

        await flushPromises();

        expect(onSuccess).not.toBeCalled();
        expect(onError).toBeCalledWith({
          id: toDataStreamId({ assetId: ASSET_1, propertyId: PROPERTY_1 }),
          resolution: 0,
          error: ERR_MESSAGE,
        });
      });
    });

    it('gets latest value when provided with a duration and `fetchLatestBeforeEnd` is true', async () => {
      const getAssetPropertyValue = jest.fn().mockResolvedValue(ASSET_PROPERTY_DOUBLE_VALUE);
      const getAssetPropertyAggregates = jest.fn();
      const getAssetPropertyValueHistory = jest.fn();
      const getInterpolatedAssetPropertyValues = jest.fn();

      const mockSDK = createMockSiteWiseSDK({
        getAssetPropertyValue,
        getAssetPropertyValueHistory,
        getAssetPropertyAggregates,
        getInterpolatedAssetPropertyValues,
      });

      const dataSource = createDataSource(mockSDK);

      const query: SiteWiseDataStreamQuery = {
        source: SITEWISE_DATA_SOURCE,
        assets: [{ assetId: 'some-asset-id', properties: [{ propertyId: 'some-property-id' }] }],
      };

      const onError = jest.fn();
      const onSuccess = jest.fn();

      dataSource.initiateRequest(
        {
          onError,
          onSuccess,
          query,
          request: LAST_MINUTE_REQUEST,
        },
        [
          {
            id: toDataStreamId({ assetId: 'some-asset-id', propertyId: 'some-property-id' }),
            start: new Date(),
            end: new Date(),
            resolution: 0,
          },
        ]
      );

      await flushPromises();

      expect(getAssetPropertyAggregates).not.toBeCalled();
      expect(getAssetPropertyValueHistory).not.toBeCalled();
      expect(getInterpolatedAssetPropertyValues).not.toBeCalled();

      expect(getAssetPropertyValue).toBeCalledTimes(1);
      expect(getAssetPropertyValue).toBeCalledWith({
        assetId: query.assets[0].assetId,
        propertyId: query.assets[0].properties[0].propertyId,
      });

      expect(onError).not.toBeCalled();

      expect(onSuccess).toBeCalledTimes(1);
      expect(onSuccess).toBeCalledWith([
        expect.objectContaining({
          id: toDataStreamId({ assetId: 'some-asset-id', propertyId: 'some-property-id' }),
          data: [{ x: 1000099, y: 10.123 }],
          resolution: 0,
        }),
      ]);
    });

    it('gets latest value for multiple properties', () => {
      const getAssetPropertyValue = jest.fn().mockResolvedValue(ASSET_PROPERTY_DOUBLE_VALUE);

      const mockSDK = createMockSiteWiseSDK({ getAssetPropertyValue });

      const dataSource = createDataSource(mockSDK);

      const ASSET_ID = 'some-asset-id';
      const PROPERTY_1 = 'prop-1';
      const PROPERTY_2 = 'prop-2';

      const query: SiteWiseDataStreamQuery = {
        source: SITEWISE_DATA_SOURCE,
        assets: [{ assetId: ASSET_ID, properties: [{ propertyId: PROPERTY_1 }, { propertyId: PROPERTY_2 }] }],
      };

      dataSource.initiateRequest(
        {
          onError: noop,
          onSuccess: noop,
          query,
          request: LAST_MINUTE_REQUEST,
        },
        [
          {
            id: toDataStreamId({ assetId: ASSET_ID, propertyId: PROPERTY_1 }),
            start: new Date(),
            end: new Date(),
            resolution: 0,
          },
          {
            id: toDataStreamId({ assetId: ASSET_ID, propertyId: PROPERTY_2 }),
            start: new Date(),
            end: new Date(),
            resolution: 0,
          },
        ]
      );

      expect(getAssetPropertyValue).toBeCalledTimes(2);

      expect(getAssetPropertyValue).toBeCalledWith({
        assetId: ASSET_ID,
        propertyId: PROPERTY_1,
      });

      expect(getAssetPropertyValue).toBeCalledWith({
        assetId: ASSET_ID,
        propertyId: PROPERTY_2,
      });
    });

    it('gets latest value for multiple assets', () => {
      const getAssetPropertyValue = jest.fn().mockResolvedValue(ASSET_PROPERTY_DOUBLE_VALUE);

      const mockSDK = createMockSiteWiseSDK({ getAssetPropertyValue });

      const dataSource = createDataSource(mockSDK);

      const ASSET_1 = 'asset-1';
      const ASSET_2 = 'asset-2';
      const PROPERTY_1 = 'prop-1';
      const PROPERTY_2 = 'prop-2';

      const query: SiteWiseDataStreamQuery = {
        source: SITEWISE_DATA_SOURCE,
        assets: [
          { assetId: ASSET_1, properties: [{ propertyId: PROPERTY_1 }] },
          { assetId: ASSET_2, properties: [{ propertyId: PROPERTY_2 }] },
        ],
      };

      dataSource.initiateRequest(
        {
          onError: noop,
          onSuccess: noop,
          query,
          request: LAST_MINUTE_REQUEST,
        },
        [
          {
            id: toDataStreamId({ assetId: ASSET_1, propertyId: PROPERTY_1 }),
            start: new Date(),
            end: new Date(),
            resolution: 0,
          },
          {
            id: toDataStreamId({ assetId: ASSET_2, propertyId: PROPERTY_2 }),
            start: new Date(),
            end: new Date(),
            resolution: 0,
          },
        ]
      );

      expect(getAssetPropertyValue).toBeCalledTimes(2);

      expect(getAssetPropertyValue).toBeCalledWith({
        assetId: ASSET_1,
        propertyId: PROPERTY_1,
      });

      expect(getAssetPropertyValue).toBeCalledWith({
        assetId: ASSET_2,
        propertyId: PROPERTY_2,
      });
    });
  });
});

it('requests raw data if specified per asset property', async () => {
  const getAssetPropertyValue = jest.fn();
  const getAssetPropertyAggregates = jest.fn();
  const getAssetPropertyValueHistory = jest.fn().mockResolvedValue(ASSET_PROPERTY_VALUE_HISTORY);
  const getInterpolatedAssetPropertyValues = jest.fn();

  const mockSDK = createMockSiteWiseSDK({
    getAssetPropertyValue,
    getAssetPropertyValueHistory,
    getAssetPropertyAggregates,
    getInterpolatedAssetPropertyValues,
  });

  const dataSource = createDataSource(mockSDK);

  const query: SiteWiseDataStreamQuery = {
    source: SITEWISE_DATA_SOURCE,
    assets: [
      {
        assetId: 'some-asset-id',
        properties: [{ propertyId: 'some-property-id', resolution: '0' }],
      },
    ],
  };

  const onError = jest.fn();
  const onSuccess = jest.fn();

  dataSource.initiateRequest(
    {
      onError,
      onSuccess,
      query,
      request: {
        viewport: {
          duration: MINUTE_IN_MS * 55,
        },
        settings: {
          fetchFromStartToEnd: true,
          resolution: '1m',
        },
      },
    },
    [
      {
        id: toDataStreamId({ assetId: 'some-asset-id', propertyId: 'some-property-id' }),
        start: new Date(),
        end: new Date(),
        resolution: 0,
      },
    ]
  );

  await flushPromises();

  expect(getAssetPropertyValue).not.toBeCalled();
  expect(getInterpolatedAssetPropertyValues).not.toBeCalled();

  expect(getAssetPropertyAggregates).not.toBeCalled();

  expect(getAssetPropertyValueHistory).toBeCalledTimes(1);
  expect(getAssetPropertyValueHistory).toBeCalledWith(
    expect.objectContaining({
      assetId: query.assets[0].assetId,
      propertyId: query.assets[0].properties[0].propertyId,
    })
  );

  expect(onError).not.toBeCalled();

  expect(onSuccess).toBeCalledTimes(1);

  expect(onSuccess).toBeCalledWith([
    expect.objectContaining({
      id: toDataStreamId({ assetId: 'some-asset-id', propertyId: 'some-property-id' }),
      data: [
        { x: 1000099, y: 10.123 },
        { x: 2000000, y: 12.01 },
      ],
      resolution: 0,
    }),
  ]);
});

describe('e2e through data-module', () => {
  describe('fetching range of historical data', () => {
    it('reports error occurred on request initiation', async () => {
      const dataModule = new IotAppKitDataModule();

      const ERR_MESSAGE = 'some critical error! page oncall immediately';
      const getAssetPropertyValueHistory = jest.fn().mockRejectedValue(new Error(ERR_MESSAGE));

      const mockSDK = createMockSiteWiseSDK({ getAssetPropertyValueHistory });
      const dataSource = createDataSource(mockSDK);

      dataModule.registerDataSource(dataSource);

      const timeSeriesCallback = jest.fn();
      const assetId = 'asset-id';
      const propertyId = 'property-id';

      const { unsubscribe } = dataModule.subscribeToDataStreams(
        {
          queries: [
            {
              assets: [{ assetId, properties: [{ propertyId }] }],
              source: dataSource.name,
            } as SiteWiseDataStreamQuery,
          ],
          request: HISTORICAL_REQUEST,
        },
        timeSeriesCallback
      );

      await flushPromises();

      expect(timeSeriesCallback).toBeCalledTimes(2);
      expect(timeSeriesCallback).toHaveBeenLastCalledWith(
        expect.objectContaining({
          dataStreams: [
            expect.objectContaining({
              id: toDataStreamId({ assetId, propertyId }),
              error: ERR_MESSAGE,
              isLoading: false,
              isRefreshing: false,
            }),
          ],
        })
      );

      unsubscribe();
    });
  });

  describe('fetching latest value', () => {
    it('reports error occurred on request initiation', async () => {
      const dataModule = new IotAppKitDataModule();

      const ERR_MESSAGE = 'some critical error! page oncall immediately';
      const getAssetPropertyValue = jest.fn().mockRejectedValue(new Error(ERR_MESSAGE));

      const mockSDK = createMockSiteWiseSDK({ getAssetPropertyValue });
      const dataSource = createDataSource(mockSDK);

      dataModule.registerDataSource(dataSource);

      const timeSeriesCallback = jest.fn();
      const assetId = 'asset-id';
      const propertyId = 'property-id';

      const { unsubscribe } = dataModule.subscribeToDataStreams(
        {
          queries: [
            {
              assets: [{ assetId, properties: [{ propertyId }] }],
              source: dataSource.name,
            } as SiteWiseDataStreamQuery,
          ],
          request: {
            viewport: { start: new Date(2000, 0, 0), end: new Date() },
            settings: { fetchMostRecentBeforeEnd: true },
          },
        },
        timeSeriesCallback
      );

      await flushPromises();

      expect(timeSeriesCallback).toBeCalledTimes(2);
      expect(timeSeriesCallback).toHaveBeenLastCalledWith(
        expect.objectContaining({
          dataStreams: [
            expect.objectContaining({
              id: toDataStreamId({ assetId, propertyId }),
              error: ERR_MESSAGE,
              isLoading: false,
              isRefreshing: false,
            }),
          ],
        })
      );

      unsubscribe();
    });
  });
});

describe('aggregated data', () => {
  it('requests aggregated data with correct resolution based on resolutionMap and uses default aggregate type', async () => {
    const getAssetPropertyValue = jest.fn();
    const getAssetPropertyAggregates = jest.fn().mockResolvedValue(AGGREGATE_VALUES);
    const getAssetPropertyValueHistory = jest.fn();
    const getInterpolatedAssetPropertyValues = jest.fn();

    const mockSDK = createMockSiteWiseSDK({
      getAssetPropertyValue,
      getAssetPropertyValueHistory,
      getAssetPropertyAggregates,
      getInterpolatedAssetPropertyValues,
    });

    const dataSource = createDataSource(mockSDK);

    const query: SiteWiseDataStreamQuery = {
      source: SITEWISE_DATA_SOURCE,
      assets: [{ assetId: 'some-asset-id', properties: [{ propertyId: 'some-property-id' }] }],
    };

    const onError = jest.fn();
    const onSuccess = jest.fn();

    dataSource.initiateRequest(
      {
        onError,
        onSuccess,
        query,
        request: {
          viewport: {
            duration: HOUR_IN_MS * 59,
          },
          settings: {
            fetchMostRecentBeforeEnd: false,
            resolution: {
              [HOUR_IN_MS * 60]: '1d',
              [MINUTE_IN_MS * 15]: '1h',
            },
          },
        },
      },
      [
        {
          id: toDataStreamId({ propertyId: 'some-property-id', assetId: 'some-asset-id' }),
          start: new Date(),
          end: new Date(),
          resolution: 0,
        },
      ]
    );

    await flushPromises();

    expect(getAssetPropertyValue).not.toBeCalled();
    expect(getAssetPropertyValueHistory).not.toBeCalled();
    expect(getInterpolatedAssetPropertyValues).not.toBeCalled();

    expect(getAssetPropertyAggregates).toBeCalledTimes(1);
    expect(getAssetPropertyAggregates).toBeCalledWith(
      expect.objectContaining({
        assetId: query.assets[0].assetId,
        propertyId: query.assets[0].properties[0].propertyId,
        aggregateTypes: ['AVERAGE'],
        resolution: '1h',
      })
    );

    expect(onError).not.toBeCalled();

    expect(onSuccess).toBeCalledTimes(1);
    expect(onSuccess).toBeCalledWith([
      expect.objectContaining({
        id: toDataStreamId({ assetId: 'some-asset-id', propertyId: 'some-property-id' }),
        aggregates: {
          [HOUR_IN_MS]: [
            {
              x: 946602000000,
              y: 5,
            },
            {
              x: 946605600000,
              y: 7,
            },
            {
              x: 946609200000,
              y: 10,
            },
          ],
        },
        resolution: HOUR_IN_MS,
      }),
    ]);
  });

  it('requests specific resolution', async () => {
    const getAssetPropertyValue = jest.fn();
    const getAssetPropertyAggregates = jest.fn().mockResolvedValue(AGGREGATE_VALUES);
    const getAssetPropertyValueHistory = jest.fn();
    const getInterpolatedAssetPropertyValues = jest.fn();

    const mockSDK = createMockSiteWiseSDK({
      getAssetPropertyValue,
      getAssetPropertyValueHistory,
      getAssetPropertyAggregates,
      getInterpolatedAssetPropertyValues,
    });

    const dataSource = createDataSource(mockSDK);

    const query: SiteWiseDataStreamQuery = {
      source: SITEWISE_DATA_SOURCE,
      assets: [{ assetId: 'some-asset-id', properties: [{ propertyId: 'some-property-id' }] }],
    };

    const onError = jest.fn();
    const onSuccess = jest.fn();

    const resolution = '1m';

    dataSource.initiateRequest(
      {
        onError,
        onSuccess,
        query,
        request: {
          viewport: {
            duration: MINUTE_IN_MS * 55,
          },
          settings: {
            fetchFromStartToEnd: true,
            resolution: resolution,
          },
        },
      },
      [
        {
          id: toDataStreamId({ assetId: 'some-asset-id', propertyId: 'some-property-id' }),
          start: new Date(),
          end: new Date(),
          resolution: 0,
        },
      ]
    );

    await flushPromises();

    expect(getAssetPropertyValue).not.toBeCalled();
    expect(getAssetPropertyValueHistory).not.toBeCalled();
    expect(getInterpolatedAssetPropertyValues).not.toBeCalled();

    expect(getAssetPropertyAggregates).toBeCalledTimes(1);
    expect(getAssetPropertyAggregates).toBeCalledWith(
      expect.objectContaining({
        assetId: query.assets[0].assetId,
        propertyId: query.assets[0].properties[0].propertyId,
        aggregateTypes: ['AVERAGE'],
        resolution,
      })
    );

    expect(onError).not.toBeCalled();

    expect(onSuccess).toBeCalledTimes(1);
    expect(onSuccess).toBeCalledWith([
      expect.objectContaining({
        id: toDataStreamId({ assetId: 'some-asset-id', propertyId: 'some-property-id' }),
        aggregates: {
          [MINUTE_IN_MS]: [
            {
              x: 946602000000,
              y: 5,
            },
            {
              x: 946605600000,
              y: 7,
            },
            {
              x: 946609200000,
              y: 10,
            },
          ],
        },
        resolution: MINUTE_IN_MS,
      }),
    ]);
  });

  it('requests specific resolution per asset property', async () => {
    const getAssetPropertyAggregates = jest.fn().mockResolvedValue(AGGREGATE_VALUES);
    const getAssetPropertyValueHistory = jest.fn().mockResolvedValue(ASSET_PROPERTY_VALUE_HISTORY);

    const mockSDK = createMockSiteWiseSDK({
      getAssetPropertyValueHistory,
      getAssetPropertyAggregates,
    });

    const dataSource = createDataSource(mockSDK);

    const resolution = '1m';

    const query: SiteWiseDataStreamQuery = {
      source: SITEWISE_DATA_SOURCE,
      assets: [
        {
          assetId: 'some-asset-id',
          properties: [{ propertyId: 'some-property-id', resolution }, { propertyId: 'some-property-id2' }],
        },
        {
          assetId: 'some-asset-id2',
          properties: [{ propertyId: 'some-property-id', resolution }, { propertyId: 'some-property-id2' }],
        },
      ],
    };

    const onSuccess = jest.fn();

    dataSource.initiateRequest(
      {
        onError: () => {},
        onSuccess,
        query,
        request: {
          viewport: {
            duration: MINUTE_IN_MS * 55,
          },
          settings: {
            fetchFromStartToEnd: true,
          },
        },
      },
      [
        {
          id: toDataStreamId({ assetId: 'some-asset-id', propertyId: 'some-property-id' }),
          start: new Date(),
          end: new Date(),
          resolution: 0,
        },
        {
          id: toDataStreamId({ assetId: 'some-asset-id', propertyId: 'some-property-id2' }),
          start: new Date(),
          end: new Date(),
          resolution: 0,
        },
        {
          id: toDataStreamId({ assetId: 'some-asset-id2', propertyId: 'some-property-id' }),
          start: new Date(),
          end: new Date(),
          resolution: 0,
        },
        {
          id: toDataStreamId({ assetId: 'some-asset-id2', propertyId: 'some-property-id2' }),
          start: new Date(),
          end: new Date(),
          resolution: 0,
        },
      ]
    );

    await flushPromises();

    expect(getAssetPropertyAggregates).toBeCalledTimes(2);
    expect(getAssetPropertyAggregates).toBeCalledWith(
      expect.objectContaining({
        assetId: query.assets[0].assetId,
        propertyId: query.assets[0].properties[0].propertyId,
        aggregateTypes: ['AVERAGE'],
        resolution,
      })
    );
    expect(getAssetPropertyAggregates).toBeCalledWith(
      expect.objectContaining({
        assetId: query.assets[1].assetId,
        propertyId: query.assets[1].properties[0].propertyId,
        aggregateTypes: ['AVERAGE'],
        resolution,
      })
    );

    expect(getAssetPropertyValueHistory).toBeCalledTimes(2);

    expect(getAssetPropertyValueHistory).toBeCalledWith(
      expect.objectContaining({
        assetId: query.assets[0].assetId,
        propertyId: query.assets[0].properties[1].propertyId,
      })
    );
    expect(getAssetPropertyValueHistory).toBeCalledWith(
      expect.objectContaining({
        assetId: query.assets[1].assetId,
        propertyId: query.assets[1].properties[1].propertyId,
      })
    );

    expect(onSuccess).toBeCalledTimes(4);
    expect(onSuccess).toBeCalledWith([
      expect.objectContaining({
        id: toDataStreamId({ assetId: 'some-asset-id', propertyId: 'some-property-id' }),
        aggregates: {
          [MINUTE_IN_MS]: [
            {
              x: 946602000000,
              y: 5,
            },
            {
              x: 946605600000,
              y: 7,
            },
            {
              x: 946609200000,
              y: 10,
            },
          ],
        },
        resolution: MINUTE_IN_MS,
      }),
    ]);
  });

  it('throws error when invalid resolution used in mapping', () => {
    const mockSDK = createMockSiteWiseSDK({});

    const dataSource = createDataSource(mockSDK);

    const query: SiteWiseDataStreamQuery = {
      source: SITEWISE_DATA_SOURCE,
      assets: [],
    };

    const onError = jest.fn();
    const onSuccess = jest.fn();

    expect(() => {
      dataSource.initiateRequest(
        {
          onError,
          onSuccess,
          query,
          request: {
            viewport: {
              duration: HOUR_IN_MS,
            },
            settings: {
              fetchMostRecentBeforeEnd: false,
              fetchFromStartToEnd: true,
              resolution: {
                [MINUTE_IN_MS]: 'not_a_valid_resolution',
              },
            },
          },
        },
        []
      );
    }).toThrow();

    expect(onError).not.toBeCalled();
    expect(onSuccess).not.toBeCalled();
  });
});

describe('gets requests from query', () => {
  it("appends refId's to the requests from the query", () => {
    const mockSDK = createMockSiteWiseSDK({});

    const dataSource = createDataSource(mockSDK);
    const REF_ID = 'some-ref';

    const query: SiteWiseDataStreamQuery = {
      source: SITEWISE_DATA_SOURCE,
      assets: [
        {
          assetId: 'asset',
          properties: [
            {
              propertyId: 'some-property',
              refId: REF_ID,
            },
          ],
        },
      ],
    };

    const request = {
      viewport: {
        duration: '1d',
      },
    };

    expect(dataSource.getRequestsFromQuery({ query, request })).toEqual([expect.objectContaining({ refId: REF_ID })]);
  });
});

it('only fetches uncached data for multiple properties', async () => {
  const dataModule = new IotAppKitDataModule();

  const getAssetPropertyValueHistory = jest.fn().mockResolvedValue(ASSET_PROPERTY_VALUE_HISTORY);

  const mockSDK = createMockSiteWiseSDK({ getAssetPropertyValueHistory });

  const query: SiteWiseDataStreamQuery = {
    source: SITEWISE_DATA_SOURCE,
    assets: [
      {
        assetId: 'some-asset-id',
        properties: [{ propertyId: 'some-property-id' }],
      },
    ],
  };

  const dataSource = createDataSource(mockSDK);

  dataModule.registerDataSource(dataSource);

  const START_1 = new Date(2000, 1, 1);
  const END_1 = new Date(2000, 2, 1);
  const START_2 = new Date(START_1.getTime() - MONTH_IN_MS);
  const END_2 = new Date(END_1.getTime() + MONTH_IN_MS);

  const dataStreamCallback = jest.fn();
  const { update, unsubscribe } = dataModule.subscribeToDataStreams(
    {
      queries: [query],
      request: { viewport: { start: START_1, end: END_1 }, settings: { fetchFromStartToEnd: true } },
    },
    dataStreamCallback
  );

  await flushPromises();

  expect(getAssetPropertyValueHistory).toBeCalledTimes(1);

  expect(getAssetPropertyValueHistory).toBeCalledWith(
    expect.objectContaining({
      startDate: START_1,
      endDate: END_1,
      assetId: query.assets[0].assetId,
      propertyId: query.assets[0].properties[0].propertyId,
    })
  );

  (getAssetPropertyValueHistory as Mock).mockClear();

  const updatedQuery: SiteWiseDataStreamQuery = {
    source: SITEWISE_DATA_SOURCE,
    assets: [
      {
        assetId: 'some-asset-id',
        properties: [{ propertyId: 'some-property-id' }, { propertyId: 'some-property-id2' }],
      },
    ],
  };

  update({ queries: [updatedQuery], request: { viewport: { start: START_2, end: END_2 } } });

  await flushPromises();

  expect(getAssetPropertyValueHistory).toBeCalledTimes(3);

  expect(getAssetPropertyValueHistory).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({
      startDate: END_1,
      endDate: END_2,
      assetId: updatedQuery.assets[0].assetId,
      propertyId: updatedQuery.assets[0].properties[0].propertyId,
    })
  );

  expect(getAssetPropertyValueHistory).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({
      startDate: START_2,
      endDate: START_1,
      assetId: updatedQuery.assets[0].assetId,
      propertyId: updatedQuery.assets[0].properties[0].propertyId,
    })
  );

  expect(getAssetPropertyValueHistory).toHaveBeenNthCalledWith(
    3,
    expect.objectContaining({
      startDate: START_2,
      endDate: END_2,
      assetId: updatedQuery.assets[0].assetId,
      propertyId: updatedQuery.assets[0].properties[1].propertyId,
    })
  );

  unsubscribe();
});

it('requests buffered data', async () => {
  const dataModule = new IotAppKitDataModule();

  const getAssetPropertyValueHistory = jest.fn().mockResolvedValue(ASSET_PROPERTY_VALUE_HISTORY);

  const mockSDK = createMockSiteWiseSDK({ getAssetPropertyValueHistory });

  const query: SiteWiseDataStreamQuery = {
    source: SITEWISE_DATA_SOURCE,
    assets: [
      {
        assetId: 'some-asset-id',
        properties: [{ propertyId: 'some-property-id' }],
      },
    ],
  };

  const dataSource = createDataSource(mockSDK);

  dataModule.registerDataSource(dataSource);

  const START = new Date(2000, 1, 1);
  const BUFFERED_START = new Date(2000, 0, 4, 15, 33, 20);
  const END = new Date(2000, 2, 1);
  const BUFFERED_END = new Date(2000, 3, 6, 5, 46, 40);

  const dataStreamCallback = jest.fn();
  const { unsubscribe } = dataModule.subscribeToDataStreams(
    {
      queries: [query],
      request: { viewport: { start: START, end: END }, settings: { fetchFromStartToEnd: true, requestBuffer: 1 } },
    },
    dataStreamCallback
  );

  await flushPromises();

  expect(getAssetPropertyValueHistory).toBeCalledTimes(1);

  expect(getAssetPropertyValueHistory).toBeCalledWith(
    expect.objectContaining({
      startDate: BUFFERED_START,
      endDate: BUFFERED_END,
      assetId: query.assets[0].assetId,
      propertyId: query.assets[0].properties[0].propertyId,
    })
  );

  unsubscribe();
});
