import type { Rect } from '~/types';

export const trimRectPosition = <R extends Rect>(rect: R): R => {
  return {
    ...rect,
    x: Math.round(rect.x),
    y: Math.round(rect.y),
    width: Math.round(rect.width),
    height: Math.round(rect.height),
  };
};
