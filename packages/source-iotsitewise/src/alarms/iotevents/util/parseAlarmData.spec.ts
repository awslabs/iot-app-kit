import { parseAlarmData } from './parseAlarmData';
import { ALARM_STATE_JSON_BLOB } from '../../../__mocks__';

it('correctly parses alarm stream and returns the state name', () => {
  expect(parseAlarmData(JSON.stringify(ALARM_STATE_JSON_BLOB))).toEqual('Active');
});

it('throws when trying to parse invalid alarm stream', () => {
  expect(() => parseAlarmData('{{')).toThrow();
});
