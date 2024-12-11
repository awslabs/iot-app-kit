import { copy } from '@iot-app-kit/helpers/objects/copy';
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

/**
 * Create an instance of a {@link Vector}
 *
 * @param vector - Vector constructor data
 * @returns vector instance
 */
export function create(vector: Partial<Vector>): Vector {
  const DEFAULT_VECTOR = { x: 0, y: 0, z: 0 } satisfies Vector;

  return copy({ ...DEFAULT_VECTOR, ...vector });
}
