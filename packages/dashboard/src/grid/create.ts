import type { RectangleDimensions } from './rectangle/types';
import type { Grid } from './types';

export function createGrid({ height, width }: RectangleDimensions): Grid {
  return { x: 0, y: 0, height, width };
}
