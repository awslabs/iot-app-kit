import { isCompleteAlarmStream } from './isCompleteAlarmStream';
import { ALARM, ASSET_MODEL_WITH_ALARM, ALARM_STATE_PROPERTY_ID, INPUT_PROPERTY_ID } from '../../../__mocks__';

const alarmStreamId = 'alarm-asset-id---alarm-state-property-id';
const inputPropertyStreamId = 'alarm-asset-id---input-property-id';

it('should return true if not an alarm stream', () => {
  expect(
    isCompleteAlarmStream({
      propertyId: INPUT_PROPERTY_ID,
      dataStreamId: inputPropertyStreamId,
      assetModel: ASSET_MODEL_WITH_ALARM,
      alarms: {
        [alarmStreamId]: ALARM,
      },
    })
  ).toEqual(true);
});

it('should return true if alarm stream is complete', () => {
  expect(
    isCompleteAlarmStream({
      propertyId: ALARM_STATE_PROPERTY_ID,
      dataStreamId: alarmStreamId,
      assetModel: ASSET_MODEL_WITH_ALARM,
      alarms: {
        [alarmStreamId]: ALARM,
      },
    })
  ).toEqual(true);
});

it('should return false if alarm stream is not complete', () => {
  expect(
    isCompleteAlarmStream({
      propertyId: ALARM_STATE_PROPERTY_ID,
      dataStreamId: alarmStreamId,
      assetModel: ASSET_MODEL_WITH_ALARM,
      alarms: {},
    })
  ).toEqual(false);
});
