import { COMPARISON_OPERATOR, DataStreamInfo, DataType, StatusIcon, StreamType, ViewPort } from '@synchro-charts/core';
import { DataStream } from './data-module/types';
import { DAY_IN_MS } from './common/time';
import { Threshold } from './common/types';

const VIEW_PORT: ViewPort = {
  start: new Date(2000, 0, 0, 0),
  end: new Date(2001, 0, 0, 0),
  yMin: 0,
  yMax: 100,
};

/**
 * Shared Mock Data
 */
// Number 1
export const NUMBER_INFO_1: DataStreamInfo = {
  id: 'number-some-id',
  resolution: 0,
  dataType: DataType.NUMBER,
  color: 'cyan',
  name: 'number-some-name',
};

export const NUMBER_STREAM_1: DataStream<number> = {
  id: NUMBER_INFO_1.id,
  color: 'cyan',
  name: 'number-some-name',
  dataType: NUMBER_INFO_1.dataType,
  resolution: 0,
  data: [
    {
      x: new Date(2000, 0, 0, 0, 0).getTime(),
      y: 100,
    },
  ],
};

/**
 * String Mock Data
 */

// String Info 1
export const STRING_INFO_1: DataStreamInfo = {
  id: 'some-string-info',
  resolution: 0,
  dataType: DataType.STRING,
  color: 'red',
  name: 'some-name',
};

export const DATA_STREAM_INFO: DataStreamInfo = {
  id: 'some-asset-id---some-property-id',
  resolution: 0,
  detailedName: 'data-stream-name/detailed-name',
  name: 'data-stream-name',
  color: 'black',
  dataType: DataType.NUMBER,
};

export const DATA_STREAM: DataStream = {
  ...DATA_STREAM_INFO,
  data: [],
};

export const DATA_STREAM_2: DataStream = {
  id: 'some-asset-id-2---some-property-id-2',
  name: 'data-stream-name-2',
  color: 'black',
  resolution: 0,
  dataType: DataType.NUMBER,
  data: [],
};

export const ALARM = 'alarm';
export const OK = 'ok';

export const ALARM_STREAM_INFO: DataStreamInfo = {
  id: 'alarm-stream',
  resolution: 0,
  dataType: DataType.STRING,
  streamType: StreamType.ALARM,
  name: 'alarm stream',
  color: 'red',
};
export const NON_BREACHED_ALARM_INFO: DataStreamInfo = {
  id: 'alarm-stream-2',
  resolution: 0,
  dataType: DataType.STRING,
  streamType: StreamType.ALARM,
  name: 'alarm stream 2',
  color: 'blue',
};
export const WITHIN_VIEWPORT_DATE = new Date(2000, 0, 1);
export const BEFORE_VIEWPORT_DATE = new Date(VIEW_PORT.start.getTime() - DAY_IN_MS);

export const ALARM_STREAM: DataStream<string> = {
  id: 'alarm-stream',
  dataType: DataType.STRING,
  name: 'alarm stream',
  color: 'red',
  streamType: StreamType.ALARM,
  resolution: 0,
  data: [
    {
      x: WITHIN_VIEWPORT_DATE.getTime(),
      y: ALARM,
    },
  ],
};

export const ALARM_THRESHOLD: Threshold<string> = {
  value: ALARM,
  color: 'orange',
  comparisonOperator: COMPARISON_OPERATOR.EQUAL,
  icon: StatusIcon.ACTIVE,
};

export const STRING_STREAM_1: DataStream<string> = {
  id: STRING_INFO_1.id,
  dataType: DataType.STRING,
  color: 'red',
  name: 'some-name',
  resolution: 0,
  data: [
    {
      x: new Date(2000, 0, 0, 0, 0).getTime(),
      y: 'ALARM',
    },
  ],
};

export const THRESHOLD_1: Threshold<number> = {
  isEditable: true,
  comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
  value: 35,
  label: {
    text: '1',
    show: true,
  },
  showValue: true,
  color: 'red',
  severity: 1,
  audioAlert: { volume: 0.6 },
};

export const THRESHOLD_2: Threshold<number> = {
  isEditable: true,
  comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
  value: 25,
  label: {
    text: '2',
    show: true,
  },
  showValue: true,
  color: 'green',
  severity: 2,
};
