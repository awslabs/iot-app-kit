import type { DataType, StreamType, ComparisonOperator, StatusIconType } from '../data-module/types';

export const DATA_TYPE: { [dataType: string]: DataType } = {
  NUMBER: 'NUMBER',
  BOOLEAN: 'BOOLEAN',
  STRING: 'STRING',
};

export const STREAM_TYPE: { [streamType: string]: StreamType } = {
  ALARM: 'ALARM',
  ANOMALY: 'ANOMALY',
  ALARM_THRESHOLD: 'ALARM_THRESHOLD',
};

export const COMPARISON_OPERATOR: { [comparisonOperator: string]: ComparisonOperator } = {
  LT: 'LT',
  GT: 'GT',
  LTE: 'LTE',
  GTE: 'GTE',
  EQ: 'EQ',
  CONTAINS: 'CONTAINS',
};

export const STATUS_ICON_TYPE: { [statusIconType: string]: StatusIconType } = {
  error: 'error',
  active: 'active',
  normal: 'normal',
  acknowledged: 'acknowledged',
  snoozed: 'snoozed',
  disabled: 'disabled',
  latched: 'latched',
};
