import type { Vector } from './types';

export default function subtract(b: Vector) {
  return (a: Vector): Vector => {
    return {
      x: a.x - b.x,
      z: a.z - b.z,
      y: a.y - b.y,
    };
  };
}
