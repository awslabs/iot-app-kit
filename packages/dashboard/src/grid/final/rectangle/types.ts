import type { Point } from '../point/types';

/**
 * Rectangle placed in a three-dimensional space with an inverted y axis.
 */
export interface Rectangle {
  /** Position of the top-left corner of the rectangle. */
  min: Point;
  /** Position of the bottom-right corner of the rectangle. */
  max: Point;
  /** Position of the rectangle along the z-axis. */
  z: number;
}
