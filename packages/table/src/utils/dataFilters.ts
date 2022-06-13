import { bisector } from 'd3-array';
import { DataPoint, Primitive } from '@synchro-charts/core';

// By doing the mapping to a date within the bisector
// we eliminate the need to iterate over the entire data.
// (As opposed to mapping entire data to an array of dates)
export const pointBisector = bisector((p: DataPoint<Primitive>) => p.x);

/**
 * Returns all data before or at the given date.
 *
 * Assumes data is ordered chronologically.
 */
export const getDataBeforeDate = <T extends Primitive>(data: DataPoint<T>[], date: Date): DataPoint<T>[] => {
  // If there is no data
  if (data.length === 0) {
    return [];
  }
  // If all data is after the view port
  if (date.getTime() < data[0].x) {
    return [];
  }

  // Otherwise return all the data within the viewport, plus an additional single data point that falls outside of
  // the viewport in either direction.
  const endIndex = Math.min(pointBisector.right(data, date) - 1, data.length - 1);
  return data.slice(0, endIndex + 1);
};
