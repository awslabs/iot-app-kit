import { DataStream } from '@iot-app-kit/core';

export const start = new Date(2022, 1, 1);
export const end = new Date(2022, 2, 1);
export const viewport = { start, end };

export const labels = { 'label-1': 'value-1', 'label-2': 'value-2', propertyName: 'test' };
export const streamId = JSON.stringify(labels);
export const numberStream: DataStream = {
  id: streamId,
  data: [
    { x: start.getTime(), y: 1 },
    { x: end.getTime(), y: 2 },
  ],
  dataType: 'NUMBER',
  resolution: 0,
};
export const stringStream: DataStream = {
  id: streamId,
  data: [
    { x: start.getTime(), y: 'xxx' },
    { x: end.getTime(), y: 'yyy' },
  ],
  dataType: 'STRING',
  resolution: 0,
};
export const booleanStream: DataStream = {
  id: streamId,
  data: [
    { x: start.getTime(), y: 'true' },
    { x: end.getTime(), y: 'false' },
  ],
  dataType: 'BOOLEAN',
  resolution: 0,
};
