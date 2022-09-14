import { fetchAlarmsFromQuery } from './fetchAlarmsFromQuery';
import { SiteWiseAlarmModule } from '../siteWiseAlarmModule';
import { SiteWiseAssetDataSource, SiteWiseAssetModule } from '../../../asset-modules';
import { createSiteWiseAssetDataSource } from '../../../asset-modules/asset-data-source';
import {
  ALARM_ASSET_ID,
  ALARM_MODEL,
  ALARM_PROPERTY_VALUE_HISTORY,
  ALARM_SOURCE_PROPERTY_VALUE,
  ALARM_STATE_PROPERTY_VALUE,
  ASSET_MODEL_WITH_ALARM,
  ALARM_STATE_PROPERTY_ID,
  createMockIoTEventsSDK,
  createMockSiteWiseSDK,
  THRESHOLD_PROPERTY_VALUE,
  TIME_SERIES_DATA_WITH_ALARMS,
  ALARM,
} from '../../../__mocks__';

const getAlarmModule = (
  { siteWiseApiOverride, eventsApiOverride } = { siteWiseApiOverride: {}, eventsApiOverride: {} }
) => {
  const iotEventsClient = createMockIoTEventsSDK(eventsApiOverride);
  const siteWiseClient = createMockSiteWiseSDK(siteWiseApiOverride);

  const assetDataSource: SiteWiseAssetDataSource = createSiteWiseAssetDataSource(siteWiseClient);
  const siteWiseAssetModule = new SiteWiseAssetModule(assetDataSource);
  const alarmModule = new SiteWiseAlarmModule(iotEventsClient, siteWiseAssetModule);

  return { alarmModule };
};

it('correctly parses query and yields alarms and annotations', async () => {
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

  const { alarmModule } = getAlarmModule({
    siteWiseApiOverride: {
      describeAsset,
      describeAssetModel,
      getAssetPropertyValue,
      batchGetAssetPropertyValueHistory,
    },
    eventsApiOverride: {
      getAlarmModel,
    },
  });

  const alarms = fetchAlarmsFromQuery({
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
    alarmModule,
  });

  expect(await alarms.next()).toEqual(
    expect.objectContaining({
      value: {
        alarms: {
          'alarm-asset-id---alarm-state-property-id': ALARM,
        },
        annotations: TIME_SERIES_DATA_WITH_ALARMS.annotations,
      },
    })
  );
});
