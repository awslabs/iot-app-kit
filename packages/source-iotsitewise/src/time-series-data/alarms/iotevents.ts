export const SOURCE = 'iotevents';

export const ALARM_STATUS = {
  ACTIVE: 'Active',
  NORMAL: 'Normal',
  LATCHED: 'Latched',
  DISABLED: 'Disabled',
  ACKNOWLEDGED: 'Acknowledged',
  SNOOZE_DISABLED: 'SnoozeDisabled',
} as const;

export type UpperCaseStateName = keyof typeof ALARM_STATUS;
export type PascalCaseStateName = typeof ALARM_STATUS[UpperCaseStateName];

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
  } catch {
    throw new Error('Could not parse alarm data');
  }
};
