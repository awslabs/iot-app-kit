import { type LegendConfig } from '@iot-app-kit/charts-core';

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

export enum StatusIconType {
  ERROR = 'error',
  ACTIVE = 'active',
  NORMAL = 'normal',
  ACKNOWLEDGED = 'acknowledged',
  SNOOZED = 'snoozed',
  DISABLED = 'disabled',
  LATCHED = 'latched',
}

export enum DATA_ALIGNMENT {
  EITHER = 'EITHER',
  RIGHT = 'RIGHT',
  LEFT = 'LEFT',
}

export const DEFAULT_LEGEND: LegendConfig = {
  position: LEGEND_POSITION.BOTTOM,
  width: 0,
};

export const ECHARTS_GESTURE = 'echarts-gesture';

export const DEFAULT_DECIMAL_PLACES = 4;

export const CHART_ALARM_ERROR = { msg: 'Error fetching alarm data' };
