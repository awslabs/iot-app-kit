import { DataStream, DataStreamInfo } from '../../utils/dataTypes';
import { Threshold } from '../../components/charts/common/types';
import { VIEWPORT } from '../../components/charts/common/testUtil';
import { DAY_IN_MS } from '../../utils/time';
import { DataType, StreamType } from '../../utils/dataConstants';
import { COMPARISON_OPERATOR, StatusIcon } from '../../components/common/constants';

export const START_DATE = new Date(2000, 0, 0);

/**
 * Shared Mock Data
 */

// Empty Number
export const NUMBER_EMPTY_INFO: DataStreamInfo = {
  id: 'empty-info-id',
  resolution: 0,
  dataType: DataType.NUMBER,
  color: 'blue',
  name: 'empty-info-name',
};
export const NUMBER_EMPTY_STREAM: DataStream<number> = {
  id: NUMBER_EMPTY_INFO.id,
  dataType: NUMBER_EMPTY_INFO.dataType,
  data: [],
  color: 'blue',
  name: 'empty-info-name',
  resolution: 0,
};

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

// Number 2
export const NUMBER_INFO_2: DataStreamInfo = {
  id: 'number-some-id-2',
  resolution: 0,
  dataType: DataType.NUMBER,
  color: 'black',
  name: 'number-some-name-2',
};
export const NUMBER_STREAM_2: DataStream<number> = {
  id: NUMBER_INFO_2.id,
  color: 'black',
  name: 'number-some-name-2',
  dataType: NUMBER_INFO_2.dataType,
  resolution: 0,
  data: [
    {
      x: new Date(2000, 0, 0, 0, 0).getTime(),
      y: 9999,
    },
  ],
};

/**
 * String Mock Data
 */

// Empty String
export const STRING_EMPTY_INFO: DataStreamInfo = {
  id: 'empty-string-info-id',
  resolution: 0,
  dataType: DataType.STRING,
  color: 'purple',
  name: 'string-empty-info',
};
export const STRING_EMPTY_STREAM: DataStream<string> = {
  id: STRING_EMPTY_INFO.id,
  dataType: DataType.STRING,
  color: 'purple',
  name: 'string-empty-info',
  data: [],
  resolution: 0,
};

// String Info 1
export const STRING_INFO_1: DataStreamInfo = {
  id: 'some-id',
  resolution: 0,
  dataType: DataType.STRING,
  color: 'red',
  name: 'some-name',
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

// String Info 2
export const STRING_INFO_2: DataStreamInfo = {
  id: 'some-id-2',
  resolution: 0,
  dataType: DataType.STRING,
  color: 'green',
  name: 'some-name-2',
};
export const STRING_STREAM_2: DataStream<string> = {
  id: STRING_INFO_2.id,
  color: 'green',
  name: 'some-name-2',
  dataType: STRING_INFO_2.dataType,
  resolution: 0,
  data: [
    {
      x: new Date(2000, 0, 0, 0, 0).getTime(),
      y: 'OK',
    },
  ],
};

export const DATA_STREAM_INFO: DataStreamInfo = {
  id: 'some-id',
  resolution: 0,
  detailedName: 'data-stream-name/detailed-name',
  name: 'data-stream-name',
  color: 'black',
  dataType: DataType.NUMBER,
};

export const DATA_STREAM: DataStream<number> = {
  id: 'some-id',
  detailedName: 'data-stream-name/detailed-name',
  name: 'data-stream-name',
  color: 'black',
  resolution: 0,
  dataType: DataType.NUMBER,
  data: [],
};

export const DATA_STREAM_2: DataStream<number> = {
  id: 'id-2',
  name: 'data-stream-name-2',
  color: 'black',
  resolution: 0,
  dataType: DataType.NUMBER,
  data: [],
};

const THRESHOLD_VALUE = 20;
export const THRESHOLD: Threshold = {
  color: 'purple',
  value: THRESHOLD_VALUE,
  comparisonOperator: COMPARISON_OPERATOR.LESS_THAN,
};

// since we have a 'less than' operation, it breaches if it is below the threshold value.
export const BREACHING_VALUE = THRESHOLD_VALUE - 1;
export const NON_BREACHING_VALUE = THRESHOLD_VALUE;
/**
 * Construct mock alarms streams and related resources
 */

export const ALARM = 'alarm';
export const OK = 'ok';

export const ALARM_THRESHOLD: Threshold<string> = {
  value: ALARM,
  color: 'orange',
  comparisonOperator: COMPARISON_OPERATOR.EQUAL,
  icon: StatusIcon.ACTIVE,
};

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

export const DATA_WITH_ALARM_INFO: DataStreamInfo = {
  ...DATA_STREAM_INFO,
  associatedStreams: [
    { id: ALARM_STREAM_INFO.id, type: StreamType.ALARM },
    { id: NON_BREACHED_ALARM_INFO.id, type: StreamType.ALARM },
  ],
};

export const WITHIN_VIEWPORT_DATE = new Date(2000, 0, 1);
export const BEFORE_VIEWPORT_DATE = new Date(VIEWPORT.start.getTime() - DAY_IN_MS);

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

export const DATA_WITH_ALARM_ASSOCIATION: DataStream = {
  ...DATA_STREAM,
  associatedStreams: [
    { id: ALARM_STREAM.id, type: StreamType.ALARM },
    { id: NON_BREACHED_ALARM_INFO.id, type: StreamType.ALARM },
  ],
};

export const NON_BREACHED_ALARM_STREAM: DataStream<string> = {
  id: NON_BREACHED_ALARM_INFO.id,
  name: NON_BREACHED_ALARM_INFO.name,
  detailedName: NON_BREACHED_ALARM_INFO.detailedName,
  color: NON_BREACHED_ALARM_INFO.color,
  dataType: NON_BREACHED_ALARM_INFO.dataType,
  streamType: StreamType.ALARM,
  resolution: 0,
  data: [
    {
      x: WITHIN_VIEWPORT_DATE.getTime(),
      y: OK,
    },
  ],
};
