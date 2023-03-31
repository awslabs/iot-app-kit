import { getAlarmStateProperty } from './getAlarmStateProperty';
import { ASSET_MODEL_WITH_ALARM, ALARM_STATE_PROPERTY_ID, ALARM_STATE_PROPERTY } from '../../../__mocks__';

it('get alarm source from asset model', () => {
  expect(getAlarmStateProperty(ASSET_MODEL_WITH_ALARM, ALARM_STATE_PROPERTY_ID)).toEqual({
    ...ALARM_STATE_PROPERTY,
    name: 'test',
  });
});
