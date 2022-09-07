import { SiteWiseAlarmModule } from './siteWiseAlarmModule';
import {
  ALARM,
  ALARM_ASSET_ID,
  ALARM_MODEL,
  ALARM_MODEL_NAME,
  ALARM_PROPERTY_VALUE_HISTORY,
  ALARM_SOURCE_PROPERTY_VALUE,
  ALARM_STATE_PROPERTY_ID,
  ALARM_STATE_PROPERTY_VALUE,
  ASSET_MODEL_WITH_ALARM,
  THRESHOLD_PROPERTY_VALUE,
  CACHED_ALARM_MODEL,
} from '../../__mocks__/alarm';
import { createMockIoTEventsSDK, createMockSiteWiseSDK } from '../../__mocks__';
import { SiteWiseAssetDataSource, SiteWiseAssetModule } from '../../asset-modules';
import { createSiteWiseAssetDataSource } from '../../asset-modules/asset-data-source';

const initAlarmModule = (
  { siteWiseApiOverride = {}, eventsApiOverride = {} } = { siteWiseApiOverride: {}, eventsApiOverride: {} }
) => {
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

  const assetDataSource: SiteWiseAssetDataSource = createSiteWiseAssetDataSource(
    createMockSiteWiseSDK({
      describeAsset,
      describeAssetModel,
      getAssetPropertyValue,
      batchGetAssetPropertyValueHistory,
      ...siteWiseApiOverride,
    })
  );
  const siteWiseAssetModule = new SiteWiseAssetModule(assetDataSource);
  const alarmModule = new SiteWiseAlarmModule(
    createMockIoTEventsSDK({
      getAlarmModel,
      ...eventsApiOverride,
    }),
    siteWiseAssetModule
  );

  return { alarmModule };
};

it('can get alarm model', async () => {
  const { alarmModule } = initAlarmModule();

  expect(await alarmModule.getAlarmModel(ALARM_MODEL_NAME)).toEqual(CACHED_ALARM_MODEL);
});

it('can get alarm', async () => {
  const { alarmModule } = initAlarmModule();

  expect(
    await alarmModule.getAlarm({
      assetId: ALARM_ASSET_ID,
      alarmStatePropertyId: ALARM_STATE_PROPERTY_ID,
    })
  ).toEqual(ALARM);
});

it('returns undefined if exception caught', async () => {
  const { alarmModule } = initAlarmModule({
    eventsApiOverride: {
      getAlarmModel: jest.fn().mockResolvedValue(new Error()),
    },
  });

  expect(
    await alarmModule.getAlarm({
      assetId: ALARM_ASSET_ID,
      alarmStatePropertyId: ALARM_STATE_PROPERTY_ID,
    })
  ).toEqual(undefined);
});

it('returns undefined if alarm source not found in composite model', async () => {
  const { alarmModule } = initAlarmModule({
    siteWiseApiOverride: {
      describeAssetModel: jest.fn().mockResolvedValue({
        ...ASSET_MODEL_WITH_ALARM,
        assetModelCompositeModels: undefined,
      }),
    },
  });

  expect(
    await alarmModule.getAlarm({
      assetId: ALARM_ASSET_ID,
      alarmStatePropertyId: ALARM_STATE_PROPERTY_ID,
    })
  ).toEqual(undefined);
});
