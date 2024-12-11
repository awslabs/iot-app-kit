import { combine } from '@iot-app-kit/helpers/objects/combine';
import type { Rectangle } from './types';
import type { PartialDeep } from 'type-fest';
import createPoint from '../point/create';

export interface CreateOptions {
  round?: boolean;
}

/**
 * Create an instance of a {@link Rectangle}
 *
 * @param rectangle - Rectangle constructor data
 * @returns rectangle instance
 */
export function create(options: CreateOptions) {
  return (rectangle: PartialDeep<Rectangle> = {}): Rectangle => {
    const roundedPoint = createPoint({ round: true });
    const DEFAULT_RECTANGLE = {
      min: roundedPoint({ x: 0, y: 0 }),
      max: roundedPoint({ x: 100, y: 100 }),
      z: 1,
    } as const satisfies Rectangle;
    const r = combine(DEFAULT_RECTANGLE)(rectangle);

    if (options.round) {
      return {
        min: roundedPoint(r.min),
        max: roundedPoint(r.max),
        z: Math.round(r.z),
      };
    }

    return r;
  };
}
