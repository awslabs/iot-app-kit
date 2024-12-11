import type { Point } from './types';

export default function distance(to: Point) {
  return (from: Point): vector.Vector2d => {
    const diff = difference(a, b);

    return vector.create({
      x: Math.abs(diff.x),
      y: Math.abs(diff.y),
    });
  };
}
