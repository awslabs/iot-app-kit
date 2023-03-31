import { fetchAlarmsFromQuery } from './fetchAlarmsFromQuery';
import { SiteWiseAlarmModule } from '../siteWiseAlarmModule';
import { SiteWiseAssetModule } from '../../../asset-modules';
import { createSiteWiseAssetDataSource } from '../../../asset-modules/asset-data-source';
import {
  ALARM_ASSET_ID,
  ALARM_MODEL,
  ALARM_PROPERTY_VALUE_HISTORY,
  ALARM_SOURCE_PROPERTY_VALUE,
  ALARM_STATE_PROPERTY_VALUE,
  ASSET_MODEL_WITH_ALARM,
  ALARM_STATE_PROPERTY_ID,
  THRESHOLD_PROPERTY_VALUE,
  TIME_SERIES_DATA_WITH_ALARMS,
  ALARM,
} from '../../../__mocks__';
import type { SiteWiseAssetDataSource } from '../../../asset-modules';
import { createMockIoTEventsSDK, createMockSiteWiseSDK } from '@iot-app-kit/testing-util';

const getMockedAlarmModule = (
  { siteWiseApiOverride, eventsApiOverride } = { siteWiseApiOverride: {}, eventsApiOverride: {} }
) => {
  /**
   * Default Mocks
   */
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

  /**
   * Mocked clients
   */
  const iotEventsClient = createMockIoTEventsSDK({ getAlarmModel, ...eventsApiOverride });
  const siteWiseClient = createMockSiteWiseSDK({
    describeAsset,
    describeAssetModel,
    getAssetPropertyValue,
    batchGetAssetPropertyValueHistory,
    ...siteWiseApiOverride,
  });

  const assetDataSource: SiteWiseAssetDataSource = createSiteWiseAssetDataSource(siteWiseClient);
  const siteWiseAssetModule = new SiteWiseAssetModule(assetDataSource);

  return new SiteWiseAlarmModule(iotEventsClient, siteWiseAssetModule);
};

it('correctly parses query and yields alarms and thresholds', async () => {
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
    alarmModule: getMockedAlarmModule(),
  });

  expect(await alarms.next()).toEqual(
    expect.objectContaining({
      value: {
        alarms: {
          'alarm-asset-id---alarm-state-property-id': ALARM,
        },
        thresholds: TIME_SERIES_DATA_WITH_ALARMS.thresholds,
      },
    })
  );
});

it('does not return alarms for property alias query', async () => {
  const alarms = fetchAlarmsFromQuery({
    queries: [
      {
        properties: [{ propertyAlias: 'property/alias/for/test' }],
      },
    ],
    alarmModule: getMockedAlarmModule(),
  });

  expect(await alarms.next()).toEqual(
    expect.objectContaining({
      value: undefined,
    })
  );
});
