import { type Bisector } from 'd3-array';
import { type Interval } from '../../../queries';

export const alarmValueFilterer =
  <Point>(
    bisector: Bisector<Point, Date>,
    extractTime: (point: Point) => number
  ) =>
  (points: Point[], { end }: Interval, includeBoundaryPoints = true) => {
    if (points.length === 0) {
      return [];
    }

    // If all data is after the view port
    if (end.getTime() < extractTime(points[0])) {
      return [];
    }

    // Otherwise return all the data before the end of the viewport
    const startIndex = Math.max(0);
    const endIndex = Math.min(
      bisector.right(points, end) - (includeBoundaryPoints ? 0 : 1),
      points.length - 1
    );

    return points.slice(startIndex, endIndex + 1);
  };
