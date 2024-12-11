import type { Point } from '#types';

export interface CreatePointOptions {
  round?: boolean;
}

export function createPoint(
  { x, y }: Point,
  options: CreatePointOptions = {}
): Point {
  if (options.round) {
    return {
      x: Math.round(x),
      y: Math.round(y),
    };
  }

  return { x, y };
}
