import intersect from 'box-intersect';
import type { Rect } from '~/types';

export const isContained = (a: Rect, b: Rect): boolean => {
  const contained = intersect([
    [a.x, a.y, a.x + a.width, a.y + a.height],
    [b.x, b.y, b.x + b.width, b.y + b.height],
  ]);

  return contained.length != 0;
};
