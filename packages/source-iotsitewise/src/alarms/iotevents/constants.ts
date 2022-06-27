import { COMPARISON_OPERATOR, StatusIcon } from '@synchro-charts/core';
import { ComparisonOperator } from '@aws-sdk/client-iot-events';

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

export const ALARM_STATUS_MAP: { [status: string]: { color: string; icon: StatusIcon; severity: number } } = {
  [ALARM_STATUS.ACTIVE]: {
    color: AWSUI_RED_600,
    icon: StatusIcon.ACTIVE,
    severity: 1,
  },
  [ALARM_STATUS.LATCHED]: {
    color: '#f89256',
    icon: StatusIcon.LATCHED,
    severity: 2,
  },
  [ALARM_STATUS.ACKNOWLEDGED]: {
    color: '#3184c2',
    icon: StatusIcon.ACKNOWLEDGED,
    severity: 3,
  },
  [ALARM_STATUS.NORMAL]: {
    color: '#1d8102',
    icon: StatusIcon.NORMAL,
    severity: 4,
  },
  [ALARM_STATUS.SNOOZE_DISABLED]: {
    color: '#879596',
    icon: StatusIcon.SNOOZED,
    severity: 5,
  },
  [ALARM_STATUS.DISABLED]: {
    color: '#687078',
    icon: StatusIcon.DISABLED,
    severity: 6,
  },
} as const;

export const SynchroChartsToIoTEventsComparisonOperator: { [key: string]: ComparisonOperator } = {
  [COMPARISON_OPERATOR.GREATER_THAN]: ComparisonOperator.GREATER,
  [COMPARISON_OPERATOR.GREATER_THAN_EQUAL]: ComparisonOperator.GREATER_OR_EQUAL,
  [COMPARISON_OPERATOR.LESS_THAN]: ComparisonOperator.LESS,
  [COMPARISON_OPERATOR.LESS_THAN_EQUAL]: ComparisonOperator.LESS_OR_EQUAL,
  [COMPARISON_OPERATOR.EQUAL]: ComparisonOperator.EQUAL,
  NEQ: ComparisonOperator.NOT_EQUAL,
};

export const IoTEventsToSynchroChartsComparisonOperator: { [key: string]: COMPARISON_OPERATOR | 'NEQ' } = {
  [ComparisonOperator.GREATER]: COMPARISON_OPERATOR.GREATER_THAN,
  [ComparisonOperator.GREATER_OR_EQUAL]: COMPARISON_OPERATOR.GREATER_THAN_EQUAL,
  [ComparisonOperator.LESS]: COMPARISON_OPERATOR.LESS_THAN,
  [ComparisonOperator.LESS_OR_EQUAL]: COMPARISON_OPERATOR.LESS_THAN_EQUAL,
  [ComparisonOperator.EQUAL]: COMPARISON_OPERATOR.EQUAL,
  [ComparisonOperator.NOT_EQUAL]: 'NEQ',
};

export const COMPARISON_SYMBOL = {
  [COMPARISON_OPERATOR.EQUAL]: '=',
  [COMPARISON_OPERATOR.LESS_THAN]: '<',
  [COMPARISON_OPERATOR.LESS_THAN_EQUAL]: '<=',
  [COMPARISON_OPERATOR.GREATER_THAN]: '>',
  [COMPARISON_OPERATOR.GREATER_THAN_EQUAL]: '>=',
};
