import { composeSiteWiseProviders, SiteWiseTimeSeriesDataProvider } from './provider';
import { SiteWiseAssetModule } from '../..';
import { IotAppKitDataModule } from '../../data-module/IotAppKitDataModule';
import { createSiteWiseAssetDataSource } from './asset-data-source';
import { DESCRIBE_ASSET_RESPONSE } from '../__mocks__/asset';
import { SiteWiseComponentSession } from '../component-session';
import { DATA_STREAM } from '../__mocks__/mockWidgetProperties';
import { SiteWiseDataStreamQuery } from './types';
import { MINUTE_IN_MS } from '../../common/time';
import { createMockSiteWiseSDK } from '../__mocks__/iotsitewiseSDK';
import { DataSource, DataStream } from '../../data-module/types';

const createMockSource = (dataStreams: DataStream[]): DataSource<SiteWiseDataStreamQuery> => ({
  name: 'site-wise',
  initiateRequest: jest.fn(({ onSuccess }: any) => onSuccess(dataStreams)),
  getRequestsFromQuery: () => dataStreams.map((dataStream) => ({ id: dataStream.id, resolution: 0 })),
});

const timeSeriesModule = new IotAppKitDataModule();
const dataSource = createMockSource([DATA_STREAM]);
timeSeriesModule.registerDataSource(dataSource);

const assetModule = new SiteWiseAssetModule(
  createSiteWiseAssetDataSource(
    createMockSiteWiseSDK({
      describeAsset: () => Promise.resolve(DESCRIBE_ASSET_RESPONSE),
    })
  )
);

const componentSession = new SiteWiseComponentSession({
  componentId: 'componentId',
  siteWiseAssetModule: assetModule,
  siteWiseTimeSeriesModule: timeSeriesModule,
});

beforeAll(() => {
  jest.useFakeTimers('modern');
});

afterAll(() => {
  jest.useRealTimers();
});

it('subscribes, updates, and unsubscribes to time series data by delegating to underlying data modules', () => {
  const START_1 = new Date(2020, 0, 0);
  const END_1 = new Date();

  const refreshRate = MINUTE_IN_MS;

  const provider = new SiteWiseTimeSeriesDataProvider(componentSession, {
    queries: [{ source: 'site-wise', assets: [] }],
    request: {
      viewport: { start: START_1, end: END_1 },
      settings: { fetchFromStartToEnd: true, refreshRate },
    },
  });

  const timeSeriesCallback = jest.fn();

  // subscribe
  provider.subscribe(timeSeriesCallback);

  expect(timeSeriesCallback).toBeCalledWith({
    dataStreams: [
      expect.objectContaining({
        id: DATA_STREAM.id,
      }),
    ],
    viewport: {
      start: START_1,
      end: END_1,
    },
  });

  timeSeriesCallback.mockClear();

  // update
  const START_2 = new Date(2019, 0, 0);
  const END_2 = new Date();

  provider.updateSubscription({
    request: { viewport: { start: START_2, end: END_2 } },
  });

  expect(timeSeriesCallback).toBeCalledWith({
    dataStreams: [
      expect.objectContaining({
        id: DATA_STREAM.id,
      }),
    ],
    viewport: {
      start: START_2,
      end: END_2,
    },
  });

  timeSeriesCallback.mockClear();

  // update viewport
  const START_3 = new Date(2018, 0, 0);
  const END_3 = new Date();

  provider.updateViewport({
    start: START_3,
    end: END_3,
  });

  expect(timeSeriesCallback).toBeCalledWith({
    dataStreams: [
      expect.objectContaining({
        id: DATA_STREAM.id,
      }),
    ],
    viewport: {
      start: START_3,
      end: END_3,
    },
  });

  timeSeriesCallback.mockClear();

  // check that subscription refreshes
  jest.advanceTimersByTime(refreshRate);

  expect(timeSeriesCallback).toHaveBeenCalled();

  timeSeriesCallback.mockClear();

  // unsubscribe
  provider.unsubscribe();

  jest.advanceTimersByTime(refreshRate);

  expect(timeSeriesCallback).not.toHaveBeenCalled();
});

describe('composeSiteWiseProviders', () => {
  it('merges the inputs for multiple providers, taking session and request settings from the first provider', () => {
    const START = new Date(2020, 0, 0);
    const END = new Date();

    const query1 = { source: 'site-wise', assets: [] };
    const query2 = { source: 'custom', assets: [] };
    const query3 = { source: 'my-source', assets: [] };
    const query4 = {
      source: 'site-wise',
      assets: [{ assetId: 'some-asset-id', properties: [{ propertyId: 'some-property-id' }] }],
    };

    const provider1 = new SiteWiseTimeSeriesDataProvider(componentSession, {
      queries: [query1],
      request: {
        viewport: { start: START, end: END },
        settings: { fetchFromStartToEnd: true },
      },
    });

    const provider2 = new SiteWiseTimeSeriesDataProvider(componentSession, {
      queries: [query2],
      request: {
        viewport: { start: START, end: END },
        settings: { fetchFromStartToEnd: true },
      },
    });

    const provider3 = new SiteWiseTimeSeriesDataProvider(componentSession, {
      queries: [query3, query4],
      request: {
        viewport: { start: START, end: END },
        settings: { fetchFromStartToEnd: false },
      },
    });

    const composedProvider = composeSiteWiseProviders([provider1, provider2, provider3]);

    expect(composedProvider.session).toEqual(componentSession);
    expect(composedProvider.input).toEqual({
      queries: [query1, query2, query3, query4],
      request: provider1.input.request,
    });
  });

  it('throws error if provider list is empty', () => {
    expect(() => composeSiteWiseProviders([])).toThrow(
      'composeSiteWiseProviders must be called with at least one provider'
    );
  });

  it('returns the provider if there is only one', () => {
    const START = new Date(2020, 0, 0);
    const END = new Date();

    const provider = new SiteWiseTimeSeriesDataProvider(componentSession, {
      queries: [{ source: 'site-wise', assets: [] }],
      request: {
        viewport: { start: START, end: END },
        settings: { fetchFromStartToEnd: true },
      },
    });

    expect(composeSiteWiseProviders([provider])).toBe(provider);
  });
});
