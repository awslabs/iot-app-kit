import { getAlarmSourceProperty } from './getAlarmSourceProperty';
import { ASSET_MODEL_WITH_ALARM, ALARM_STATE_PROPERTY_ID, ALARM_SOURCE_PROPERTY } from '../../../__mocks__';

it('get alarm source from asset model', () => {
  expect(getAlarmSourceProperty(ASSET_MODEL_WITH_ALARM, ALARM_STATE_PROPERTY_ID)).toEqual(ALARM_SOURCE_PROPERTY);
});
