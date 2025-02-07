import type { Rectangle } from '~/types';

const max = Math.max;
const min = Math.min;

export const constrainWidgetPositionToGrid: <R extends Rectangle = Rectangle>(
  gridRect: Rectangle,
  rect: R
) => R = (gridRect, rect) => ({
  ...rect,
  x: max(0, min(gridRect.width - rect.width, max(gridRect.x, rect.x))),
  y: max(0, min(gridRect.height - rect.height, max(gridRect.y, rect.y))),
  height: min(gridRect.height, max(rect.height, 0)),
  width: min(gridRect.width, max(rect.width, 0)),
});
