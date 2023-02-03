import { pointBisector, getDataBeforeDate } from './dataFilters';
import { DataPoint, DataStream, Primitive } from '../common/dataTypes';
import { getDataPoints } from './getDataPoints';
import { sortTooltipPoints } from './sort';
import { DATA_ALIGNMENT } from '../common/constants';

export type ActivePoint<T extends Primitive> = {
  // The id of the data stream that this point is associated with
  streamId: string;
  // An optional label for the data point. Most use cases should default this to the name of the data stream.
  label?: string;
  // The point that is closest to the current selected date, if there is one.
  point?: DataPoint<T>;
};

/**
 * To differentiate between points that come from data streams and points that come from trend lines
 */
export const enum POINT_TYPE {
  DATA = 'data',
  TREND = 'trend',
}
export type ActivePointWithType<T extends Primitive> = ActivePoint<T> & { type: POINT_TYPE };

/**
 * Closest Points
 *
 * Returns the closest point to the left, and right of a
 * given point in time..
 *
 * @param maxDistance - maximum distance, measured in terms of milliseconds. if not present, there is no max distance.
 */
export const closestPoint = <T extends Primitive>(
  dataPoints: DataPoint<T>[],
  date: Date,
  dataAlignment: DATA_ALIGNMENT,
  maxDistance?: number
): DataPoint<T> | undefined => {
  const idx = pointBisector.left(dataPoints, date);
  const leftPoint: DataPoint<T> | undefined = dataPoints[idx - 1];
  const rightPoint: DataPoint<T> | undefined = dataPoints[idx];

  /**
   * If a point falls on our point of time, return it immediately regardless of 'data alignment'.
   */
  if (leftPoint && leftPoint.x === date.getTime()) {
    return leftPoint;
  }
  if (rightPoint && rightPoint.x === date.getTime()) {
    return rightPoint;
  }

  /** Right Alignment */
  if (dataAlignment === DATA_ALIGNMENT.RIGHT) {
    if (!rightPoint) {
      return undefined;
    }
    if (maxDistance == null) {
      return rightPoint;
    }
    return rightPoint.x - date.getTime() <= maxDistance ? rightPoint : undefined;
  }

  /** Left Alignment */
  if (dataAlignment === DATA_ALIGNMENT.LEFT) {
    if (!leftPoint) {
      return undefined;
    }
    if (maxDistance == null) {
      return leftPoint;
    }
    return date.getTime() - leftPoint.x <= maxDistance ? leftPoint : undefined;
  }

  /** Either Alignment */
  // If only the left, or only the right point exist, go ahead and just return it.
  if (!leftPoint || !rightPoint) {
    return leftPoint || rightPoint;
  }

  // We are right bias because the interval between two points is the time span for the point on the right.
  return rightPoint;
};

/**
 * Get Active Points
 *
 * Returns at most one point per data stream - for each data stream, it finds the point which is
 * 1. within the given view port
 * 2. closest to the provided `selectedDate`
 *
 * Additionally, if `allowMultipleDates` is false, it will only return the points which are the closest
 * to the `selectedDate`. i.e. if you have 10 points that are all equally distant from the `selectedDate`,
 * all 10 are returned.
 *
 * However if you have 10 points of different dates, only the closest point would be returned.
 */
export const activePoints = <T extends Primitive>({
  viewport,
  dataStreams,
  selectedDate,
  allowMultipleDates,
  dataAlignment,
  maxDurationFromDate,
}: {
  viewport: { start: Date; end: Date };
  dataStreams: DataStream<T>[];
  selectedDate: Date;
  // Whether we allow points containing different x values (dates).
  allowMultipleDates: boolean;
  dataAlignment: DATA_ALIGNMENT;
  maxDurationFromDate?: number; // if no max distance present, then no max distance filter is applied on selected points
}): ActivePoint<T>[] => {
  const dataStreamUtilizedData = dataStreams.map((stream) => ({
    streamId: stream.id,
    dataPoints: getDataBeforeDate(getDataPoints(stream, stream.resolution), viewport.end),
  }));
  const selectedTimestamp = selectedDate.getTime();

  // Find the closest point to the selected date for each stream
  const points = dataStreamUtilizedData.map(({ streamId, dataPoints }) => ({
    streamId,
    point: closestPoint(dataPoints, selectedDate, dataAlignment, maxDurationFromDate),
  }));

  if (allowMultipleDates) {
    return points;
  }

  const distanceFromDate = (p: DataPoint): number => Math.abs(p.x - selectedTimestamp);

  // Sort in ascending order by there distance from the selected date
  const sortedPoints = points.sort(sortTooltipPoints(distanceFromDate));

  if (sortedPoints.length === 0) {
    return [];
  }

  const topPoint = sortedPoints[sortedPoints.length - 1].point;
  if (topPoint == null) {
    // everything must be a 'blank' point
    return sortedPoints;
  }

  // Filter such that only the points with a date equal to the date of the point which is closest to the selected date.
  return sortedPoints.filter((p) => p.point && p.point.x === topPoint.x);
};
