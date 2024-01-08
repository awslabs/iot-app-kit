import type {
  ComparisonOperator,
  DataType,
  StatusIconType,
  StreamType,
} from '../data-module/types';

export const DATA_TYPE: { [dataType in DataType]: DataType } = {
  NUMBER: 'NUMBER',
  BOOLEAN: 'BOOLEAN',
  STRING: 'STRING',
};

export const STREAM_TYPE: { [streamType in StreamType]: StreamType } = {
  ALARM: 'ALARM',
  ANOMALY: 'ANOMALY',
  ALARM_THRESHOLD: 'ALARM_THRESHOLD',
};

export const COMPARISON_OPERATOR: {
  [comparisonOperator in ComparisonOperator]: ComparisonOperator;
} = {
  LT: 'LT',
  GT: 'GT',
  LTE: 'LTE',
  GTE: 'GTE',
  EQ: 'EQ',
  CONTAINS: 'CONTAINS',
};

export const STATUS_ICON_TYPE: {
  [statusIconType in StatusIconType]: StatusIconType;
} = {
  error: 'error',
  active: 'active',
  normal: 'normal',
  acknowledged: 'acknowledged',
  snoozed: 'snoozed',
  disabled: 'disabled',
  latched: 'latched',
};
