import { Bisector } from 'd3-array';
import { Interval } from '../types';

export const timeSeriesDataFilterer =
  <Point>(
    bisector: Bisector<Point, Date>,
    extractTime: (point: Point) => number
  ) =>
  (points: Point[], { start, end }: Interval, includeBoundaryPoints = true) => {
    if (points.length === 0) {
      return [];
    }
    // If all data is before the view port
    if (start.getTime() > extractTime(points[points.length - 1])) {
      return [];
    }
    // If all data is after the view port
    if (end.getTime() < extractTime(points[0])) {
      return [];
    }

    // Otherwise return all the data within the viewport, plus an additional single data point that falls outside of
    // the viewport in either direction.
    const startIndex = Math.max(
      bisector.left(points, start) - (includeBoundaryPoints ? 1 : 0),
      0
    );
    const endIndex = Math.min(
      bisector.right(points, end) - (includeBoundaryPoints ? 0 : 1),
      points.length - 1
    );

    return points.slice(startIndex, endIndex + 1);
  };
