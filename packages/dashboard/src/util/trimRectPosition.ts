import type { Rectangle } from '~/types';

export const trimRectPosition = <R extends Rectangle>(rect: R): R => {
  return {
    ...rect,
    x: Math.round(rect.x),
    y: Math.round(rect.y),
    width: Math.max(1, Math.round(rect.width)), // prevent rounding a widget to 0 width
    height: Math.max(1, Math.round(rect.height)), // prevent rounding a widget to 0 height
  };
};
