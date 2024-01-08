import {
  COMPARISON_OPERATOR,
  DATA_TYPE,
  STATUS_ICON_TYPE,
  STREAM_TYPE,
} from './common/constants';
import { DAY_IN_MS } from './common/time';
import type { Threshold } from './common/types';
import type { DataStream } from './data-module/types';

const VIEW_PORT = {
  start: new Date(2000, 0, 0, 0),
  end: new Date(2001, 0, 0, 0),
  yMin: 0,
  yMax: 100,
};

export const NUMBER_STREAM_1: DataStream<number> = {
  id: 'number-some-id',
  color: 'cyan',
  name: 'number-some-name',
  dataType: DATA_TYPE.NUMBER,
  resolution: 0,
  data: [
    {
      x: new Date(2000, 0, 0, 0, 0).getTime(),
      y: 100,
    },
  ],
};

export const DATA_STREAM: DataStream = {
  id: 'some-asset-id---some-property-id',
  resolution: 0,
  detailedName: 'data-stream-name/detailed-name',
  name: 'data-stream-name',
  color: 'black',
  dataType: DATA_TYPE.NUMBER,
  data: [],
};

export const DATA_STREAM_2: DataStream = {
  id: 'some-asset-id-2---some-property-id-2',
  name: 'data-stream-name-2',
  color: 'black',
  resolution: 0,
  dataType: DATA_TYPE.NUMBER,
  data: [],
};

export const ALARM = 'alarm';
export const OK = 'ok';

export const WITHIN_VIEWPORT_DATE = new Date(2000, 0, 1);
export const BEFORE_VIEWPORT_DATE = new Date(
  VIEW_PORT.start.getTime() - DAY_IN_MS
);

export const ALARM_STREAM: DataStream<string> = {
  id: 'alarm-stream',
  dataType: DATA_TYPE.STRING,
  name: 'alarm stream',
  color: 'red',
  streamType: STREAM_TYPE.ALARM,
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
  comparisonOperator: COMPARISON_OPERATOR.EQ,
  icon: STATUS_ICON_TYPE.active,
};

export const STRING_STREAM_1: DataStream<string> = {
  id: 'some-string-info',
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
