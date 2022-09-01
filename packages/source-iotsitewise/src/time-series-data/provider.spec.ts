import { SiteWiseTimeSeriesDataProvider } from './provider';
import {
  TimeSeriesDataModule,
  DataSource,
  DataStream,
  MINUTE_IN_MS,
  DATA_STREAM,
  OnSuccessCallback,
} from '@iot-app-kit/core';
import { createSiteWiseAssetDataSource } from '../asset-modules/asset-data-source';
import { DESCRIBE_ASSET_RESPONSE } from '../__mocks__/asset';
import { SiteWiseComponentSession } from '../component-session';
import { SiteWiseDataStreamQuery } from './types';
import { createMockSiteWiseSDK } from '../__mocks__/iotsitewiseSDK';
import { SiteWiseAssetModule } from '../asset-modules';

const createMockSource = (dataStreams: DataStream[]): DataSource<SiteWiseDataStreamQuery> => ({
  initiateRequest: jest.fn(({ onSuccess }: { onSuccess: OnSuccessCallback }) =>
    onSuccess(dataStreams, { start: new Date(), resolution: '1m', end: new Date(), id: '123' }, new Date(), new Date())
  ),
  getRequestsFromQuery: async () => dataStreams.map((dataStream) => ({ id: dataStream.id, resolution: '0' })),
});

const dataSource = createMockSource([DATA_STREAM]);
const timeSeriesModule = new TimeSeriesDataModule(dataSource);

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

it.skip('subscribes, updates, and unsubscribes to time series data by delegating to underlying data modules', () => {
  const START_1 = new Date(2020, 0, 0);
  const END_1 = new Date();

  const refreshRate = MINUTE_IN_MS;

  const provider = new SiteWiseTimeSeriesDataProvider(componentSession, {
    queries: [{ assets: [] }],
    request: {
      viewport: { start: START_1, end: END_1 },
      settings: { fetchFromStartToEnd: true, refreshRate },
    },
  });

  const timeSeriesCallback = jest.fn();

  // subscribe
  provider.subscribe({ next: timeSeriesCallback });

  expect(timeSeriesCallback).toBeCalledWith([
    {
      dataStreams: [
        expect.objectContaining({
          id: DATA_STREAM.id,
        }),
      ],
      viewport: {
        start: START_1,
        end: END_1,
      },
    },
  ]);

  timeSeriesCallback.mockClear();

  // update
  const START_2 = new Date(2019, 0, 0);
  const END_2 = new Date();

  provider.updateSubscription({
    request: { viewport: { start: START_2, end: END_2 } },
  });

  expect(timeSeriesCallback).toBeCalledWith([
    {
      dataStreams: [
        expect.objectContaining({
          id: DATA_STREAM.id,
        }),
      ],
      viewport: {
        start: START_2,
        end: END_2,
      },
    },
  ]);

  timeSeriesCallback.mockClear();

  // update viewport
  const START_3 = new Date(2018, 0, 0);
  const END_3 = new Date();

  provider.updateViewport({
    start: START_3,
    end: END_3,
  });

  expect(timeSeriesCallback).toBeCalledWith([
    {
      dataStreams: [
        expect.objectContaining({
          id: DATA_STREAM.id,
        }),
      ],
      viewport: {
        start: START_3,
        end: END_3,
      },
    },
  ]);

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
