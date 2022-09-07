import { subscribeToTimeSeriesData } from './subscribeToTimeSeriesData';
import { createSiteWiseAssetDataSource } from '../asset-modules/asset-data-source';
import { createMockSiteWiseSDK } from '../__mocks__/iotsitewiseSDK';
import { TimeSeriesDataModule } from '@iot-app-kit/core';
import { IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';
import { IoTEventsClient } from '@aws-sdk/client-iot-events';
import flushPromises from 'flush-promises';
import { createDataSource } from './data-source';
import { createAssetModelResponse, createAssetResponse } from '../__mocks__/asset';
import { toId } from './util/dataStreamId';
import { BATCH_ASSET_PROPERTY_VALUE_HISTORY } from '../__mocks__/assetPropertyValue';
import { SiteWiseAssetDataSource, SiteWiseAssetModule } from '../asset-modules';
import { createMockIoTEventsSDK } from '../__mocks__/ioteventsSDK';
import { SiteWiseAlarmModule } from '../alarms/iotevents';
import {
  ALARM_ASSET_ID,
  ALARM_MODEL,
  ALARM_STATE_PROPERTY_ID,
  ASSET_MODEL_WITH_ALARM,
  ALARM_SOURCE_PROPERTY_VALUE,
  ALARM_STATE_PROPERTY_VALUE,
  THRESHOLD_PROPERTY_VALUE,
  TIME_SERIES_DATA_WITH_ALARMS,
  ALARM_PROPERTY_VALUE_HISTORY,
  ALARM_ASSET_MODEL_ID,
  ALARM_SOURCE_PROPERTY_ID,
  THRESHOLD_PROPERTY_ID,
} from '../__mocks__/alarm';

const initializeSubscribeToTimeSeriesData = ({
  ioTSiteWiseClient,
  ioTEventsClient,
}: {
  ioTSiteWiseClient: IoTSiteWiseClient;
  ioTEventsClient?: IoTEventsClient;
}) => {
  const assetDataSource: SiteWiseAssetDataSource = createSiteWiseAssetDataSource(ioTSiteWiseClient);
  const siteWiseAssetModule = new SiteWiseAssetModule(assetDataSource);
  const siteWiseAssetModuleSession = siteWiseAssetModule.startSession();
  const dataModule = new TimeSeriesDataModule(createDataSource(ioTSiteWiseClient));
  const siteWiseAlarmModule = new SiteWiseAlarmModule(ioTEventsClient || createMockIoTEventsSDK(), siteWiseAssetModule);

  return subscribeToTimeSeriesData(dataModule, siteWiseAssetModuleSession, siteWiseAlarmModule);
};

it('does not emit any data streams when empty query is subscribed to', async () => {
  const subscribe = initializeSubscribeToTimeSeriesData({ ioTSiteWiseClient: createMockSiteWiseSDK() });
  const cb = jest.fn();
  const { unsubscribe } = subscribe({ queries: [], request: { viewport: { duration: '5m' } } }, cb);

  await flushPromises();

  expect(cb).not.toBeCalled();
  unsubscribe();
});

it('unsubscribes', () => {
  const assetDataSource: SiteWiseAssetDataSource = createSiteWiseAssetDataSource(createMockSiteWiseSDK());
  const siteWiseAssetModule = new SiteWiseAssetModule(assetDataSource);
  const siteWiseAssetModuleSession = siteWiseAssetModule.startSession();
  const dataModule = new TimeSeriesDataModule(createDataSource(createMockSiteWiseSDK()));
  const siteWiseAlarmModule = new SiteWiseAlarmModule(createMockIoTEventsSDK(), siteWiseAssetModule);

  const unsubscribeSpy = jest.fn();
  jest.spyOn(dataModule, 'subscribeToDataStreams').mockImplementation(() => ({
    unsubscribe: unsubscribeSpy,
    update: async () => {},
  }));

  const subscribe = subscribeToTimeSeriesData(dataModule, siteWiseAssetModuleSession, siteWiseAlarmModule);
  const { unsubscribe } = subscribe({ queries: [], request: { viewport: { duration: '5m' } } }, () => {});
  unsubscribe();

  expect(unsubscribeSpy).toBeCalled();
});

it('provides time series data from iotsitewise', async () => {
  const ASSET_ID = 'some-asset-id';
  const PROPERTY_ID = 'some-property-id';
  const ASSET_MODEL_ID = 'some-asset-model-id';
  const PROPERTY_NAME = 'some-property-name';

  const batchGetAssetPropertyValueHistory = jest.fn().mockResolvedValue(BATCH_ASSET_PROPERTY_VALUE_HISTORY);
  const describeAsset = jest
    .fn()
    .mockImplementation(({ assetId }) =>
      Promise.resolve(createAssetResponse({ assetId: assetId as string, assetModelId: ASSET_MODEL_ID }))
    );
  const describeAssetModel = jest.fn().mockImplementation(({ assetModelId }) =>
    Promise.resolve(
      createAssetModelResponse({
        assetModelId: assetModelId as string,
        propertyId: PROPERTY_ID,
        propertyName: PROPERTY_NAME,
      })
    )
  );

  const subscribe = initializeSubscribeToTimeSeriesData({
    ioTSiteWiseClient: createMockSiteWiseSDK({
      describeAsset,
      describeAssetModel,
      batchGetAssetPropertyValueHistory,
    }),
  });

  const cb = jest.fn();
  const { unsubscribe } = subscribe(
    {
      queries: [
        {
          assets: [
            {
              assetId: ASSET_ID,
              properties: [{ propertyId: PROPERTY_ID, resolution: '0' }],
            },
          ],
        },
      ],
      request: { viewport: { duration: '5m' }, settings: { fetchFromStartToEnd: true } },
    },
    cb
  );

  await flushPromises();

  // fetches the asset summary
  expect(describeAsset).toBeCalledTimes(1);
  expect(describeAsset).toBeCalledWith({ assetId: ASSET_ID });

  // fetches the asset model
  expect(describeAssetModel).toBeCalledTimes(1);
  expect(describeAssetModel).toBeCalledWith({ assetModelId: ASSET_MODEL_ID });

  // fetches historical data
  expect(batchGetAssetPropertyValueHistory).toBeCalledTimes(1);
  expect(batchGetAssetPropertyValueHistory).toBeCalledWith(
    expect.objectContaining({
      entries: expect.arrayContaining([
        expect.objectContaining({
          assetId: ASSET_ID,
          propertyId: PROPERTY_ID,
        }),
      ]),
    })
  );

  // provides the time series data
  expect(cb).toHaveBeenLastCalledWith(
    expect.objectContaining({
      dataStreams: [
        expect.objectContaining({
          id: toId({ assetId: ASSET_ID, propertyId: PROPERTY_ID }),
          name: PROPERTY_NAME,
          data: [
            { x: 1000099, y: 10.123 },
            { x: 2000000, y: 12.01 },
          ],
          dataType: 'NUMBER',
          unit: 'm/s',
        }),
      ],
    })
  );

  unsubscribe();
});

it('provides timeseries data from iotsitewise when subscription is updated', async () => {
  const ASSET_ID = 'some-asset-id';
  const PROPERTY_ID = 'some-property-id';
  const ASSET_MODEL_ID = 'some-asset-model-id';
  const PROPERTY_NAME = 'some-property-name';

  const batchGetAssetPropertyValueHistory = jest.fn().mockResolvedValue(BATCH_ASSET_PROPERTY_VALUE_HISTORY);
  const describeAsset = jest
    .fn()
    .mockImplementation(({ assetId }) =>
      Promise.resolve(createAssetResponse({ assetId: assetId as string, assetModelId: ASSET_MODEL_ID }))
    );
  const describeAssetModel = jest.fn().mockImplementation(({ assetModelId }) =>
    Promise.resolve(
      createAssetModelResponse({
        assetModelId: assetModelId as string,
        propertyId: PROPERTY_ID,
        propertyName: PROPERTY_NAME,
      })
    )
  );

  const subscribe = initializeSubscribeToTimeSeriesData({
    ioTSiteWiseClient: createMockSiteWiseSDK({
      describeAsset,
      describeAssetModel,
      batchGetAssetPropertyValueHistory,
    }),
  });

  const cb = jest.fn();
  const { update, unsubscribe } = subscribe(
    {
      queries: [],
      request: { viewport: { duration: '5m' }, settings: { fetchFromStartToEnd: true } },
    },
    cb
  );

  await flushPromises();

  update({
    queries: [
      {
        assets: [
          {
            assetId: ASSET_ID,
            properties: [{ propertyId: PROPERTY_ID, resolution: '0' }],
          },
        ],
      },
    ],
  });

  await flushPromises();

  // fetches the asset summary
  expect(describeAsset).toBeCalledTimes(1);
  expect(describeAsset).toBeCalledWith({ assetId: ASSET_ID });

  // fetches the asset model
  expect(describeAssetModel).toBeCalledTimes(1);
  expect(describeAssetModel).toBeCalledWith({ assetModelId: ASSET_MODEL_ID });

  // fetches historical data
  expect(batchGetAssetPropertyValueHistory).toBeCalledTimes(1);
  expect(batchGetAssetPropertyValueHistory).toBeCalledWith(
    expect.objectContaining({
      entries: expect.arrayContaining([
        expect.objectContaining({
          assetId: ASSET_ID,
          propertyId: PROPERTY_ID,
        }),
      ]),
    })
  );

  // provides the time series data
  expect(cb).toHaveBeenLastCalledWith(
    expect.objectContaining({
      dataStreams: [
        expect.objectContaining({
          id: toId({ assetId: ASSET_ID, propertyId: PROPERTY_ID }),
          name: PROPERTY_NAME,
          data: [
            { x: 1000099, y: 10.123 },
            { x: 2000000, y: 12.01 },
          ],
          dataType: 'NUMBER',
          unit: 'm/s',
        }),
      ],
    })
  );

  unsubscribe();
});

it('provides alarm data from iot-events', async () => {
  const getAlarmModel = jest.fn().mockResolvedValue(ALARM_MODEL);
  const describeAsset = jest.fn().mockResolvedValue({
    id: ALARM_ASSET_ID,
    assetModelId: ASSET_MODEL_WITH_ALARM.assetModelId,
  });
  const describeAssetModel = jest.fn().mockResolvedValue(ASSET_MODEL_WITH_ALARM);
  const getAssetPropertyValue = jest
    .fn()
    .mockResolvedValueOnce({
      propertyValue: ALARM_SOURCE_PROPERTY_VALUE,
    })
    .mockResolvedValueOnce({
      propertyValue: ALARM_STATE_PROPERTY_VALUE,
    })
    .mockResolvedValueOnce({
      propertyValue: THRESHOLD_PROPERTY_VALUE,
    });
  const batchGetAssetPropertyValueHistory = jest.fn().mockResolvedValue(ALARM_PROPERTY_VALUE_HISTORY);

  const subscribe = initializeSubscribeToTimeSeriesData({
    ioTEventsClient: createMockIoTEventsSDK({
      getAlarmModel,
    }),
    ioTSiteWiseClient: createMockSiteWiseSDK({
      describeAsset,
      describeAssetModel,
      getAssetPropertyValue,
      batchGetAssetPropertyValueHistory,
    }),
  });

  const cb = jest.fn();
  const { unsubscribe } = subscribe(
    {
      queries: [
        {
          assets: [
            {
              assetId: ALARM_ASSET_ID,
              properties: [{ propertyId: ALARM_STATE_PROPERTY_ID }],
            },
          ],
        },
      ],
      request: { viewport: { duration: '5m' }, settings: { fetchFromStartToEnd: true } },
    },
    cb
  );

  await flushPromises();

  // fetches the asset summary
  expect(describeAsset).toBeCalledTimes(1);
  expect(describeAsset).toBeCalledWith(expect.objectContaining({ assetId: ALARM_ASSET_ID }));

  // fetches the asset model
  expect(describeAssetModel).toBeCalledTimes(1);
  expect(describeAssetModel).toBeCalledWith(expect.objectContaining({ assetModelId: ALARM_ASSET_MODEL_ID }));

  // fetches alarm source, state and threshold property value
  expect(getAssetPropertyValue).toBeCalledTimes(3);
  expect(getAssetPropertyValue).toBeCalledWith(
    expect.objectContaining({
      assetId: ALARM_ASSET_ID,
      propertyId: ALARM_SOURCE_PROPERTY_ID,
    })
  );
  expect(getAssetPropertyValue).toBeCalledWith(
    expect.objectContaining({
      assetId: ALARM_ASSET_ID,
      propertyId: ALARM_STATE_PROPERTY_ID,
    })
  );
  expect(getAssetPropertyValue).toBeCalledWith(
    expect.objectContaining({
      assetId: ALARM_ASSET_ID,
      propertyId: THRESHOLD_PROPERTY_ID,
    })
  );

  // fetches alarm state historical value
  expect(batchGetAssetPropertyValueHistory).toBeCalledTimes(1);
  expect(batchGetAssetPropertyValueHistory).toBeCalledWith(
    expect.objectContaining({
      entries: expect.arrayContaining([
        expect.objectContaining({
          assetId: ALARM_ASSET_ID,
          propertyId: ALARM_STATE_PROPERTY_ID,
        }),
      ]),
    })
  );

  // provides the time series data
  expect(cb).toHaveBeenLastCalledWith(TIME_SERIES_DATA_WITH_ALARMS);

  unsubscribe();
});

it('provides alarm data from iot-events when subscription is updated', async () => {
  const getAlarmModel = jest.fn().mockResolvedValue(ALARM_MODEL);
  const describeAsset = jest.fn().mockResolvedValue({
    id: ALARM_ASSET_ID,
    assetModelId: ASSET_MODEL_WITH_ALARM.assetModelId,
  });
  const describeAssetModel = jest.fn().mockResolvedValue(ASSET_MODEL_WITH_ALARM);
  const getAssetPropertyValue = jest
    .fn()
    .mockResolvedValueOnce({
      propertyValue: ALARM_SOURCE_PROPERTY_VALUE,
    })
    .mockResolvedValueOnce({
      propertyValue: ALARM_STATE_PROPERTY_VALUE,
    })
    .mockResolvedValueOnce({
      propertyValue: THRESHOLD_PROPERTY_VALUE,
    });
  const batchGetAssetPropertyValueHistory = jest.fn().mockResolvedValue(ALARM_PROPERTY_VALUE_HISTORY);

  const subscribe = initializeSubscribeToTimeSeriesData({
    ioTEventsClient: createMockIoTEventsSDK({
      getAlarmModel,
    }),
    ioTSiteWiseClient: createMockSiteWiseSDK({
      describeAsset,
      describeAssetModel,
      getAssetPropertyValue,
      batchGetAssetPropertyValueHistory,
    }),
  });

  const cb = jest.fn();
  const { update, unsubscribe } = subscribe(
    {
      queries: [],
      request: { viewport: { duration: '5m' }, settings: { fetchFromStartToEnd: true } },
    },
    cb
  );

  await flushPromises();

  update({
    queries: [
      {
        assets: [
          {
            assetId: ALARM_ASSET_ID,
            properties: [{ propertyId: ALARM_STATE_PROPERTY_ID }],
          },
        ],
      },
    ],
  });

  await flushPromises();

  // fetches the asset summary
  expect(describeAsset).toBeCalledTimes(1);
  expect(describeAsset).toBeCalledWith(expect.objectContaining({ assetId: ALARM_ASSET_ID }));

  // fetches the asset model
  expect(describeAssetModel).toBeCalledTimes(1);
  expect(describeAssetModel).toBeCalledWith(expect.objectContaining({ assetModelId: ALARM_ASSET_MODEL_ID }));

  // fetches alarm source, state and threshold property value
  expect(getAssetPropertyValue).toBeCalledTimes(3);
  expect(getAssetPropertyValue).toBeCalledWith(
    expect.objectContaining({
      assetId: ALARM_ASSET_ID,
      propertyId: ALARM_SOURCE_PROPERTY_ID,
    })
  );
  expect(getAssetPropertyValue).toBeCalledWith(
    expect.objectContaining({
      assetId: ALARM_ASSET_ID,
      propertyId: ALARM_STATE_PROPERTY_ID,
    })
  );
  expect(getAssetPropertyValue).toBeCalledWith(
    expect.objectContaining({
      assetId: ALARM_ASSET_ID,
      propertyId: THRESHOLD_PROPERTY_ID,
    })
  );

  // fetches alarm state historical value
  expect(batchGetAssetPropertyValueHistory).toBeCalledTimes(1);
  expect(batchGetAssetPropertyValueHistory).toBeCalledWith(
    expect.objectContaining({
      entries: expect.arrayContaining([
        expect.objectContaining({
          assetId: ALARM_ASSET_ID,
          propertyId: ALARM_STATE_PROPERTY_ID,
        }),
      ]),
    })
  );

  // provides the time series data
  expect(cb).toHaveBeenLastCalledWith({
    ...TIME_SERIES_DATA_WITH_ALARMS,
    annotations: {
      ...TIME_SERIES_DATA_WITH_ALARMS.annotations,
      y: [...(TIME_SERIES_DATA_WITH_ALARMS.annotations.y || []), ...(TIME_SERIES_DATA_WITH_ALARMS.annotations.y || [])],
    },
  });

  unsubscribe();
});
