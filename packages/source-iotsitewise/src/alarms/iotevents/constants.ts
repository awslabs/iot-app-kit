import { COMPARISON_OPERATOR, STATUS_ICON_TYPE, StatusIconType } from '@iot-app-kit/core';

export const SOURCE = 'iotevents';

export const ALARM_STATUS = {
  ACTIVE: 'Active',
  NORMAL: 'Normal',
  LATCHED: 'Latched',
  DISABLED: 'Disabled',
  ACKNOWLEDGED: 'Acknowledged',
  SNOOZE_DISABLED: 'SnoozeDisabled',
} as const;

export const AWSUI_RED_600 = '#d13212';

export const ALARM_STATUS_MAP: { [status: string]: { color: string; icon: StatusIconType; severity: number } } = {
  [ALARM_STATUS.ACTIVE]: {
    color: AWSUI_RED_600,
    icon: STATUS_ICON_TYPE.ACTIVE,
    severity: 1,
  },
  [ALARM_STATUS.LATCHED]: {
    color: '#f89256',
    icon: STATUS_ICON_TYPE.LATCHED,
    severity: 2,
  },
  [ALARM_STATUS.ACKNOWLEDGED]: {
    color: '#3184c2',
    icon: STATUS_ICON_TYPE.ACKNOWLEDGED,
    severity: 3,
  },
  [ALARM_STATUS.NORMAL]: {
    color: '#1d8102',
    icon: STATUS_ICON_TYPE.NORMAL,
    severity: 4,
  },
  [ALARM_STATUS.SNOOZE_DISABLED]: {
    color: '#879596',
    icon: STATUS_ICON_TYPE.SNOOZED,
    severity: 5,
  },
  [ALARM_STATUS.DISABLED]: {
    color: '#687078',
    icon: STATUS_ICON_TYPE.DISABLED,
    severity: 6,
  },
} as const;

export const COMPARISON_SYMBOL = {
  [COMPARISON_OPERATOR.EQUAL]: '=',
  [COMPARISON_OPERATOR.LESS_THAN]: '<',
  [COMPARISON_OPERATOR.LESS_THAN_EQUAL]: '<=',
  [COMPARISON_OPERATOR.GREATER_THAN]: '>',
  [COMPARISON_OPERATOR.GREATER_THAN_EQUAL]: '>=',
  [COMPARISON_OPERATOR.CONTAINS]: 'contains',
};
