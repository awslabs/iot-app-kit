import { DataPoint, Primitive } from '../../../utils/dataTypes';

/**
 * Sorts points in order of their points values.
 * Places objects with no point at the end of the list.
 */
export const sortTooltipPoints = (attr: (point: DataPoint<Primitive>) => number | string | boolean) => (
  a: { point?: DataPoint<Primitive> },
  b: { point?: DataPoint<Primitive> }
): number => {
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
