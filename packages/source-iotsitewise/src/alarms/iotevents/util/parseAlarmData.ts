import { ALARM_STATUS } from '../constants';
import type { PascalCaseStateName, UpperCaseStateName } from '../types';

export const parseAlarmData = (value: string) => {
  try {
    const { stateName } = JSON.parse(value);

    let normalizedStateName: PascalCaseStateName;

    if (ALARM_STATUS[stateName as UpperCaseStateName] != null) {
      normalizedStateName = ALARM_STATUS[stateName as UpperCaseStateName];
    } else {
      normalizedStateName = stateName;
    }

    return normalizedStateName;
  } catch (err) {
    throw new Error(`Could not parse alarm data: ${err}`);
  }
};
