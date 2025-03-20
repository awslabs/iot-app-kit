import {
  DATA_TYPE,
  type DataStream,
  type HistoricalViewport,
} from '@iot-app-kit/core';

export const VIEWPORT: HistoricalViewport = {
  start: new Date(2000, 0, 0, 0),
  end: new Date(2001, 0, 0, 0),
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

export const ALARM = 'alarm';
export const OK = 'ok';
