import { DATA_TYPE, STATUS_ICON_TYPE, Threshold, DataStream, COMPARISON_OPERATOR } from '@iot-app-kit/core';
import { DAY_IN_MS } from '../utils/time';
import { VIEWPORT } from '../utils/testUtil';

export const START_DATE = new Date(2000, 0, 0);

/**
 * Shared Mock Data
 */

export const NUMBER_EMPTY_STREAM: DataStream<number> = {
  id: 'empty-info-id',
  dataType: DATA_TYPE.NUMBER,
  data: [],
  color: 'blue',
  name: 'empty-info-name',
  resolution: 0,
};

export const NUMBER_STREAM_1: DataStream<number> = {
  id: 'number-some-id',
  dataType: DATA_TYPE.NUMBER,
  color: 'cyan',
  name: 'number-some-name',
  resolution: 0,
  data: [
    {
      x: new Date(2000, 0, 0, 0, 0).getTime(),
      y: 100,
    },
  ],
};

export const NUMBER_STREAM_2: DataStream<number> = {
  id: 'number-some-id-2',
  dataType: DATA_TYPE.NUMBER,
  color: 'black',
  name: 'number-some-name-2',
  resolution: 0,
  data: [
    {
      x: new Date(2000, 0, 0, 0, 0).getTime(),
      y: 9999,
    },
  ],
};

export const STRING_STREAM_1: DataStream<string> = {
  id: 'some-id',
  dataType: DATA_TYPE.STRING,
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

export const STRING_STREAM_2: DataStream<string> = {
  id: 'some-id-2',
  color: 'green',
  name: 'some-name-2',
  dataType: DATA_TYPE.STRING,
  resolution: 0,
  data: [
    {
      x: new Date(2000, 0, 0, 0, 0).getTime(),
      y: 'OK',
    },
  ],
};

export const DATA_STREAM: DataStream<number> = {
  id: 'some-id',
  detailedName: 'data-stream-name/detailed-name',
  name: 'data-stream-name',
  color: 'black',
  resolution: 0,
  dataType: DATA_TYPE.NUMBER,
  data: [],
};

export const DATA_STREAM_2: DataStream<number> = {
  id: 'id-2',
  name: 'data-stream-name-2',
  color: 'black',
  resolution: 0,
  dataType: DATA_TYPE.NUMBER,
  data: [],
};

const THRESHOLD_VALUE = 20;
export const THRESHOLD: Threshold = {
  color: 'purple',
  value: THRESHOLD_VALUE,
  comparisonOperator: COMPARISON_OPERATOR.LT,
};

// since we have a 'less than' operation, it breaches if it is below the threshold value.
export const BREACHING_VALUE = THRESHOLD_VALUE - 1;
/**
 * Construct mock alarms streams and related resources
 */

export const ALARM = 'alarm';
export const OK = 'ok';

export const ALARM_THRESHOLD: Threshold<string> = {
  value: ALARM,
  color: 'orange',
  comparisonOperator: COMPARISON_OPERATOR.EQ,
  icon: STATUS_ICON_TYPE.active,
};

export const WITHIN_VIEWPORT_DATE = new Date(2000, 0, 1);
export const BEFORE_VIEWPORT_DATE = new Date(VIEWPORT.start.getTime() - DAY_IN_MS);
