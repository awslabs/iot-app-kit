import { bisector } from 'd3-array';

import { DataPoint, MinimalViewPortConfig, Primitive } from '../../../utils/dataTypes';
import { isMinimalStaticViewport } from '../../../utils/predicates';
import { parseDuration } from '../../../utils/time';

// By doing the mapping to a date within the bisector
// we eliminate the need to iterate over the entire data.
// (As opposed to mapping entire data to an array of dates)
export const pointBisector = bisector((p: DataPoint<Primitive>) => p.x);

/**
 * Get Visible Data
 *
 * Returns the data points which are required for the chart to correctly render.
 * This assumes linear interpolation between points
 * TODO: Support other interpolation methods
 *
 * NOTE: It's possible to have data not in the viewport which is required for the chart to render
 * it's fully visualization correctly. For Instance, even if a point isn't visible in the viewport, it may
 * be used within interpolation to calculate a path between the points which is within the viewport.
 *
 * Different interpolation methods need larger amount of context around the viewport to correctly render
 * the chart visualization.
 */
export const getVisibleData = <T extends Primitive>(
  data: DataPoint<T>[],
  viewport: MinimalViewPortConfig,
  // Whether we want to include a single point to the right, and to the left of the provide viewport.
  // This is useful when rendering lines since you need to connect a point to a point outside of the viewport
  // to fully render the data correctly.
  includeBoundaryPoints: boolean = true
): DataPoint<T>[] => {
  const start: Date = isMinimalStaticViewport(viewport)
    ? new Date(viewport.start)
    : new Date(Date.now() - parseDuration(viewport.duration));
  const end: Date = isMinimalStaticViewport(viewport) ? new Date(viewport.end) : new Date();

  // If there is no data
  if (data.length === 0) {
    return [];
  }
  // If all data is before the view port
  if (start.getTime() > data[data.length - 1].x) {
    return [];
  }
  // If all data is after the view port
  if (end.getTime() < data[0].x) {
    return [];
  }

  // Otherwise return all the data within the viewport, plus an additional single data point that falls outside of
  // the viewport in either direction.
  const startIndex = Math.max(pointBisector.left(data, start) - (includeBoundaryPoints ? 1 : 0), 0);
  const endIndex = Math.min(pointBisector.right(data, end) - (includeBoundaryPoints ? 0 : 1), data.length - 1);
  return data.slice(startIndex, endIndex + 1);
};

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
