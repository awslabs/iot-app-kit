import type { Primitive } from '@iot-app-kit/helpers';
import { pointBisector } from '@iot-app-kit/core';
import { DATA_ALIGNMENT } from '../common/constants';
import type { DataPoint } from '@iot-app-kit/core';

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
    return rightPoint.x - date.getTime() <= maxDistance
      ? rightPoint
      : undefined;
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
