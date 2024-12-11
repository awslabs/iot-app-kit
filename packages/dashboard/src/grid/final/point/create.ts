import type { Point } from './types';
import { cellIndex } from '../cell/cell-index';
import type { CellSize } from '../cell/types';
import { combine } from '@iot-app-kit/helpers/objects/combine';
import map from './map';
import { integer } from '@iot-app-kit/helpers/number/integer';
import identity from '@iot-app-kit/helpers/objects/identity';
import pipe from '@iot-app-kit/helpers/functions/pipe';

const DEFAULT_POINT = { x: 0, y: 0 } as const satisfies Point;

export interface CreateOptions {
  round?: boolean | CellSize;
}

/**
 * Create an instance of a {@link Point}
 *
 * @param point - Point constructor data
 * @returns point instance
 */
export default function create(options: CreateOptions = {}) {
  return (point: Partial<Point> = {}): Point => {
    const formatter =
      typeof options.round === 'number'
        ? cellIndex(options.round) // constrain position to cell
        : options.round
        ? Math.round // simple rounding
        : identity; // no formatting required

    return pipe(point, combine(DEFAULT_POINT), map(formatter));
  };
}

if (import.meta.vitest) {
  const { test, expect, expectTypeOf } = import.meta.vitest;

  test('point is created', () => {
    const point = create()();
    expect(point).toEqual(DEFAULT_POINT);
  });

  test('p1', () => {
    const point = create()({});
    expect(point).toEqual(DEFAULT_POINT);
  });

  test('p2', () => {
    const point = create()({ x: 10, y: 20 });
    expect(point).toEqual({ x: 10, y: 20 });
  });

  test('p3', () => {
    const point = create()({ x: 10 });
    expect(point).toEqual({ x: 10, y: 0 });
  });

  test('p4', () => {
    const point = create()({ y: 20 });
    expect(point).toEqual({ x: 0, y: 20 });
  });

  test('p5', () => {
    const point = create()({ x: 3.14, y: 2.59 });
    expect(point).toEqual({ x: 3.14, y: 2.59 });
  });

  test('p6', () => {
    const point = create({})({ x: 3.14, y: 2.59 });
    expect(point).toEqual({ x: 3.14, y: 2.59 });
  });

  test('p7', () => {
    const point = create({ round: undefined })({ x: 3.14, y: 2.59 });
    expect(point).toEqual({ x: 3.14, y: 2.59 });
  });

  test('p8', () => {
    const point = create({ round: false })({ x: 3.14, y: 2.59 });
    expect(point).toEqual({ x: 3.14, y: 2.59 });
  });

  test('p9', () => {
    const point = create({ round: true })({ x: 3.14, y: 2.59 });
    expect(point).toEqual({ x: 3, y: 3 });
  });

  test('p10', () => {
    const point = create({ round: integer(10) })({ x: 31.4, y: 25.9 });
    expect(point).toEqual({ x: 3, y: 2 });
  });

  test('p11', () => {
    const point = create({ round: integer(5) })({ x: 31.4, y: 25.9 });
    expect(point).toEqual({ x: 6, y: 5 });
  });

  test('p12', () => {
    const point = create({ round: integer(3) })({ x: 31.4, y: 25.9 });
    expect(point).toEqual({ x: 10, y: 8 });
  });

  test('p13', () => {
    const point = create({ round: integer(2) })({ x: 31.4, y: 25.9 });
    expect(point).toEqual({ x: 15, y: 12 });
  });

  test('p14', () => {
    const point = create({ round: integer(1) })({ x: 31.4, y: 25.9 });
    expect(point).toEqual({ x: 31, y: 25 });
  });

  test('p15', () => {
    const point = create({ round: integer(0) })({ x: 31.4, y: 25.9 });
    expect(point).toEqual({ x: 0, y: 0 });
  });
}
