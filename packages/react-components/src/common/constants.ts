import { LegendConfig } from '@iot-app-kit/charts-core';
import type { Viewport } from '@iot-app-kit/core';

/**
 * Stream type is a classification of a `DataStream`, which contains with it additional structure and features specific
 * to the stream type.
 *
 * For example, for an alarm stream, if a stream is associated to the alarm stream, we interpret the stream as
 * representing the status for the given alarm and present alarm specific UX such as alarm status on the legend and tooltip.
 */
export enum StreamType {
  ALARM = 'ALARM',
  ANOMALY = 'ANOMALY',
  ALARM_THRESHOLD = 'ALARM_THRESHOLD',
}

/**
 * Maps the view model to d3 axis types. In the future we could add additional
 * custom scale types beyond what's available in `d3-axis`.
 */
export enum ScaleType {
  TimeSeries = 'time-series',
  Log = 'log',
  Linear = 'linear',
}

export enum LEGEND_POSITION {
  RIGHT = 'RIGHT',
  BOTTOM = 'BOTTOM',
}

export enum COMPARISON_OPERATOR {
  LESS_THAN = 'LT',
  GREATER_THAN = 'GT',
  LESS_THAN_EQUAL = 'LTE',
  GREATER_THAN_EQUAL = 'GTE',
  EQUAL = 'EQ',
  CONTAINS = 'CONTAINS',
}

export const COMPARATOR_MAP = {
  GTE: '>=',
  GT: '>',
  LTE: '<=',
  LT: '<',
  EQ: '=',
  CONTAINS: 'Contains',
};

export enum StatusIconType {
  ERROR = 'error',
  ACTIVE = 'active',
  NORMAL = 'normal',
  ACKNOWLEDGED = 'acknowledged',
  SNOOZED = 'snoozed',
  DISABLED = 'disabled',
  LATCHED = 'latched',
}

export const STATUS_ICONS = [
  StatusIconType.ERROR,
  StatusIconType.ACTIVE,
  StatusIconType.NORMAL,
  StatusIconType.ACKNOWLEDGED,
  StatusIconType.SNOOZED,
  StatusIconType.DISABLED,
  StatusIconType.LATCHED,
];

export enum DATA_ALIGNMENT {
  EITHER = 'EITHER',
  RIGHT = 'RIGHT',
  LEFT = 'LEFT',
}

/**
 * To differentiate between points that come from data streams and points that come from trend lines
 */
export const enum POINT_TYPE {
  DATA = 'data',
  TREND = 'trend',
}

export enum TREND_TYPE {
  LINEAR = 'linear-regression',
}

export const DEFAULT_VIEWPORT: Viewport = { duration: '10m' };

export const DEFAULT_LEGEND: LegendConfig = { position: LEGEND_POSITION.BOTTOM, width: 0 };
