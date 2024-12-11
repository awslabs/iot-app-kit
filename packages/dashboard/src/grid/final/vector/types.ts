import type { Except } from 'type-fest';

/**
 * Three-dimensional vector.
 */
export interface Vector {
  /** x component of the vector. */
  readonly x: number;
  /** y component of the vector. */
  readonly y: number;
  /** z component of the vector. */
  readonly z: number;
}

export type Vector2d = Except<Vector, 'z'>;
