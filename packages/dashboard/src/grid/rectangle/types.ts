import type { Shape } from '#grid/shape/types';
import type { Height, Width } from '#grid/dimensions/types';

export type Rectangle = Shape<RectangleDimensions>;

export interface RectangleDimensions {
  /** Height of the rectangle in number of grid cells. */
  height: Height;
  /** Width of the rectangle in number of grid cells. */
  width: Width;
}

export type Anchor =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'left'
  | 'right'
  | 'top'
  | 'bottom';
