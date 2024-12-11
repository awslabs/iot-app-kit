import { combine } from '@iot-app-kit/helpers/objects/combine';
import type { Vector } from './types';
import subtract from './subtract';
import map from './map';

export interface CreateOptions {
  round?: boolean;
}

/**
 * Create an instance of a {@link Vector}
 *
 * @param vector - Vector constructor data
 * @returns vector instance
 */
export default (options: CreateOptions = {}) => {
  return (
    vector: Partial<Vector> | [Partial<Vector>, Partial<Vector>] = {}
  ): Vector => {
    const DEFAULT_VECTOR = { x: 0, y: 0, z: 0 } as const satisfies Vector;
    const defaultedVector = combine(DEFAULT_VECTOR);

    if (Array.isArray(vector)) {
      const vectorA = defaultedVector(vector[0]);
      const vectorB = defaultedVector(vector[1]);

      return subtract(vectorB)(vectorA);
    }

    const v = defaultedVector(vector);

    if (options.round) {
      return map(Math.round)(v);
    }

    return v;
  };
};
