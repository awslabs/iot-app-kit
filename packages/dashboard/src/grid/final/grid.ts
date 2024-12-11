import { copy } from '@iot-app-kit/helpers/objects/copy';
import * as rectangle from './rectangle';

/**
 * Inverted two-dimensional grid space.
 */
export interface Grid {
  rectangles: rectangle.Rectangle[];
}

export function create(grid: Grid): Grid {
  return copy(grid);
}

export function select(
  selection: rectangle.Rectangle,
  grid: Grid
): rectangle.Rectangle[] {
  return grid.rectangles.filter((r) => rectangle.isOverlapping(selection, r));
}
