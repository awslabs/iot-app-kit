import { DataPoint, DataStream, Primitive, Resolution } from './dataTypes';

/**
 * Get the points for a given resolution from a data stream
 */
export const getDataPoints = <T extends Primitive>(stream: DataStream<T>, resolution: Resolution): DataPoint<T>[] => {
  if (resolution === 0) {
    return stream.data;
  }

  if (stream.aggregates == null) {
    return [];
  }

  return stream.aggregates[resolution] || [];
};
