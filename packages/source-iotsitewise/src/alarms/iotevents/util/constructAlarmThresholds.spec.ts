import { constructAlarmThresholds } from './constructAlarmThresholds';
import { ALARM, TIME_SERIES_DATA_WITH_ALARMS } from '../../../__mocks__/alarm';

it('constructs the alarm and input property stream thresholds', () => {
  expect(constructAlarmThresholds(ALARM)).toEqual(TIME_SERIES_DATA_WITH_ALARMS.annotations.y);
});
