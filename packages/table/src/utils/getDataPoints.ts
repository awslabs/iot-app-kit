/**
 * Get the points for a given resolution from a data stream
 */
import { DataStream } from '@iot-app-kit/core';
import { DataPoint, Primitive, Resolution } from '@synchro-charts/core';

export const getDataPoints = <T extends Primitive>(stream: DataStream<T>, resolution: Resolution): DataPoint<T>[] => {
  if (resolution === 0) {
    return stream.data;
  }

  if (stream.aggregates == null) {
    return [];
  }

  return stream.aggregates[resolution] || [];
};
