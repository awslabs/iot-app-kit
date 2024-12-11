import invariant from 'tiny-invariant';
import { createDimensions } from '#grid/dimensions/create';
import { createShape } from '#grid/shape/create';
import type { Rectangle, RectangleDimensions } from './types';
import { createPosition } from '#grid/position/create';
import type { Create } from '#grid/shape/types';
import { evolve } from '@iot-app-kit/helpers/lists/evolve';
import type { F } from 'ts-toolbelt';
import { keyboard } from '@testing-library/user-event/dist/cjs/keyboard/index.js';

declare const pipe: F.Pipe;

const round = <T extends(item: Record<string, number>) => {
  return pipe(
    (item: Record<string, number>) => Object.entries(item),
    evolve(([key, value]) => [key, value])
  )(item);
};

const roundValues = evolve((item: Record<string, number>) => {
  return Object.fromEntries(
    Object.entries(item).map(([key, value]) => [key, Math.round(value)])
  );
});

export const create: Create<Rectangle> = (details, options = {}) => {
  if (options.round) {
  }
};

export const createRectangle = createShape<Rectangle>((shape, options) => {
  const position = createPosition(shape, options);
  const dimensions = createRectangleDimensions(shape, options);

  return { ...position, ...dimensions };
});

const createRectangleDimensions = createDimensions<RectangleDimensions>(
  ({ height, width }, options) => {
    invariant(height > 0, 'Expected height to be a non-zero positive number.');
    invariant(width > 0, 'Expected width to be a non-zero positive number.');

    if (options.round) {
      return {
        // Do not let a dimension be rounded to 0.
        height: Math.max(1, Math.round(height)),
        width: Math.max(1, Math.round(width)),
      };
    }

    return { height, width };
  }
);

if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;

  test('creates rectangles with integer values', () => {
    const input = { x: 1, y: 2, width: 3, height: 4 };
    const rectangle = createRectangle(input);

    expect(rectangle).toEqual(input);
  });

  test('creates rectangles with double values', () => {
    const input = { x: 1.2, y: 3.4, width: 5.6, height: 7.8 };
    const rectangle = createRectangle(input);

    expect(rectangle).toEqual(input);
  });

  test('optionally rounds doubles to integers during creation', () => {
    const input = { x: 1.2, y: 3.4, width: 5.6, height: 7.8 };
    const rectangle = createRectangle(input, { round: true });

    expect(rectangle).toEqual({ x: 1, y: 3, width: 6, height: 8 });
  });
}
