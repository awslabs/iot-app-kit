import { TimeSeriesDataModule } from '@iot-app-kit/core';
import { AggregateType } from '@aws-sdk/client-iotsitewise';
import { SiteWiseTimeSeriesDataProvider } from './provider';
import { createSiteWiseAssetDataSource } from '../asset-modules/asset-data-source';
import { SiteWiseComponentSession } from '../component-session';
import { SiteWiseAssetModule } from '../asset-modules';
import { SiteWiseAlarmModule } from '../alarms/iotevents';
import { MINUTE_IN_MS } from './util/timeConstants';
import { DESCRIBE_ASSET_RESPONSE } from '../__mocks__/asset';
import type {
  DataSource,
  DataStream,
  OnSuccessCallback,
} from '@iot-app-kit/core';
import type { SiteWiseDataStreamQuery } from './types';
import {
  createMockIoTEventsSDK,
  createMockSiteWiseSDK,
} from '@iot-app-kit/testing-util';

const DATA_STREAM: DataStream<number> = {
  id: 'some-asset-id---some-property-id',
  resolution: 0,
  detailedName: 'data-stream-name/detailed-name',
  name: 'data-stream-name',
  color: 'black',
  dataType: 'NUMBER',
  data: [],
};

const AGGREGATE_TYPE = AggregateType.AVERAGE;

const createMockSource = (
  dataStreams: DataStream[]
): DataSource<SiteWiseDataStreamQuery> => ({
  initiateRequest: vi.fn(({ onSuccess }: { onSuccess: OnSuccessCallback }) =>
    onSuccess(
      dataStreams,
      {
        start: new Date(),
        resolution: '1m',
        end: new Date(),
        id: '123',
        aggregationType: AGGREGATE_TYPE,
      },
      new Date(),
      new Date()
    )
  ),
  getRequestsFromQuery: async () =>
    dataStreams.map((dataStream) => ({ id: dataStream.id, resolution: '0' })),
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

const siteWiseAlarmModule = new SiteWiseAlarmModule(
  createMockIoTEventsSDK(),
  assetModule
);

const componentSession = new SiteWiseComponentSession({
  componentId: 'componentId',
  siteWiseAssetModule: assetModule,
  siteWiseTimeSeriesModule: timeSeriesModule,
  siteWiseAlarmModule,
});

beforeAll(() => {
  vi.useFakeTimers();
});

afterAll(() => {
  vi.useRealTimers();
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

  const timeSeriesCallback = vi.fn();

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
  vi.advanceTimersByTime(refreshRate);

  expect(timeSeriesCallback).toHaveBeenCalled();

  timeSeriesCallback.mockClear();

  // unsubscribe
  provider.unsubscribe();

  vi.advanceTimersByTime(refreshRate);

  expect(timeSeriesCallback).not.toHaveBeenCalled();
});
