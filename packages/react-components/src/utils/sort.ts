import type { DataPoint, Primitive } from '@iot-app-kit/core';

/**
 * Sorts points in order of their points values.
 * Place objects with no point at the end of the list.
 */

type PointWrapper<T extends Primitive> = { point?: DataPoint<T> };

export const sortPoints =
  <T extends Primitive>(attr: (point: DataPoint<T>) => number) =>
  (a: PointWrapper<T>, b: PointWrapper<T>): number => {
    if (a.point == null && b.point == null) {
      return 0;
    }
    if (a.point == null) {
      return -1;
    }
    if (b.point == null) {
      return 1;
    }
    if (attr(a.point) === attr(b.point)) {
      return 0;
    }
    return attr(b.point) > attr(a.point) ? 1 : -1;
  };
