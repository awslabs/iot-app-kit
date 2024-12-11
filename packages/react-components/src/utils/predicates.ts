import { DATA_TYPE, type DataStream } from '@iot-app-kit/core';

export const isValid =
  <T>(predicate: (t: Partial<T>) => boolean) =>
  (t: Partial<T>): t is T =>
    predicate(t);

export const isNumberDataStream = (
  stream: DataStream
): stream is DataStream<number> => stream.dataType === DATA_TYPE.NUMBER;

export const isNumber = <T>(val: T | number): val is number =>
  typeof val === 'number';
