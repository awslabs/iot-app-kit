import { SiteWiseTimeSeriesDataProvider } from './provider';
import { SiteWiseAssetModule } from '../..';
import { IotAppKitDataModule } from '../../data-module/IotAppKitDataModule';
import { createSiteWiseAssetDataSource } from './asset-data-source';
import { DESCRIBE_ASSET_RESPONSE } from '../__mocks__/asset';
import { AppKitComponentSession } from '../../app-kit-component-session';
import { DATA_STREAM } from '../__mocks__/mockWidgetProperties';
import { SiteWiseDataStreamQuery } from './types';
import { DataSource, DataStream } from '../../interface';
import { MINUTE_IN_MS } from '../../common/time';
import { createMockSiteWiseSDK } from '../__mocks__/iotsitewiseSDK';

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

const componentSession = new AppKitComponentSession({
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

  const START_2 = new Date(2019, 0, 0);
  const END_2 = new Date();

  timeSeriesCallback.mockClear();

  // update
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

  // check that subscription refreshes
  jest.advanceTimersByTime(refreshRate);

  expect(timeSeriesCallback).toHaveBeenCalled();

  timeSeriesCallback.mockClear();

  // unsubscribe
  provider.unsubscribe();

  jest.advanceTimersByTime(refreshRate);

  expect(timeSeriesCallback).not.toHaveBeenCalled();
});
