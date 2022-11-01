import { getAlarmModelName } from './getAlarmModelName';
import { ALARM_MODEL_ARN, ALARM_MODEL_NAME } from '../../../__mocks__';

it('gets alarm model name from arn', () => {
  expect(getAlarmModelName(ALARM_MODEL_ARN)).toEqual(ALARM_MODEL_NAME);
});
