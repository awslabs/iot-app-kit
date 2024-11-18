import {
  MOCK_ALARM_INPUT_PROPERTY_ID,
  MOCK_ALARM_INPUT_PROPERTY_ID_2,
  mockAlarmDataWithInputProperty,
  mockAlarmDataWithInputProperty2,
} from '../../../../testing/alarms';
import { alarmToSiteWiseDataStreamQuery } from './alarmToSiteWiseDataStreamQuery';

describe('alarmToSiteWiseDataStreamQuery', () => {
  it('can convert an alarm to a siteWiseDataStreamQuery', () => {
    expect(
      alarmToSiteWiseDataStreamQuery(
        [
          {
            assetId: mockAlarmDataWithInputProperty.assetId,
            inputProperty: mockAlarmDataWithInputProperty.inputProperty,
          },
          {
            assetId: mockAlarmDataWithInputProperty2.assetId,
            inputProperty: mockAlarmDataWithInputProperty2.inputProperty,
          },
          {
            assetId: 'asset-2',
            inputProperty: mockAlarmDataWithInputProperty2.inputProperty,
          },
        ],
        { aggregationType: 'AVERAGE' }
      )
    ).toMatchObject({
      assets: [
        {
          assetId: mockAlarmDataWithInputProperty.assetId,
          properties: [
            {
              propertyId: MOCK_ALARM_INPUT_PROPERTY_ID,
              aggregationType: 'AVERAGE',
            },
            {
              propertyId: MOCK_ALARM_INPUT_PROPERTY_ID_2,
              aggregationType: 'AVERAGE',
            },
          ],
        },
        {
          assetId: 'asset-2',
          properties: [
            {
              propertyId: MOCK_ALARM_INPUT_PROPERTY_ID_2,
              aggregationType: 'AVERAGE',
            },
          ],
        },
      ],
    });
  });

  it('returns an empty query if the alarm has no assetId or inputProperty', () => {
    expect(
      alarmToSiteWiseDataStreamQuery([], { aggregationType: 'AVERAGE' })
    ).toMatchObject({ assets: [] });

    expect(
      alarmToSiteWiseDataStreamQuery([{ assetId: undefined }], {
        aggregationType: 'AVERAGE',
      })
    ).toMatchObject({ assets: [] });

    expect(
      alarmToSiteWiseDataStreamQuery([{ assetId: 'asset-1' }], {
        aggregationType: 'AVERAGE',
      })
    ).toMatchObject({ assets: [] });
    expect(
      alarmToSiteWiseDataStreamQuery(
        [{ assetId: 'asset-1', inputProperty: [] }],
        { aggregationType: 'AVERAGE' }
      )
    ).toMatchObject({ assets: [] });
  });
});
