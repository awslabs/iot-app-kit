import {
  DataType,
  StreamType,
  ComparisonOperator,
  StatusIconType,
  ScaleType,
  DataAlignment,
} from '../data-module/types';

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
  LESS_THAN: 'LT',
  GREATER_THAN: 'GT',
  LESS_THAN_EQUAL: 'LTE',
  GREATER_THAN_EQUAL: 'GTE',
  EQUAL: 'EQ',
  CONTAINS: 'CONTAINS',
};

export const STATUS_ICON_TYPE: { [statusIconType: string]: StatusIconType } = {
  ERROR: 'error',
  ACTIVE: 'active',
  NORMAL: 'normal',
  ACKNOWLEDGED: 'acknowledged',
  SNOOZED: 'snoozed',
  DISABLED: 'disabled',
  LATCHED: 'latched',
};

export const SCALE_TYPE: { [scaleType: string]: ScaleType } = {
  TIME_SERIES: 'time-series',
  LOG: 'log',
  LINEAR: 'linear',
};

export const DATA_ALIGNMENT: { [dataAlignment: string]: DataAlignment } = {
  EITHER: 'EITHER',
  RIGHT: 'RIGHT',
  LEFT: 'LEFT',
};
