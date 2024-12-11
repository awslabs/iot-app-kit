import { copy } from '@iot-app-kit/helpers/objects/copy';
import * as vector from './vector';

/**
 * Point in two-dimensional space.
 */
export interface Point {
  /** x component of the point. */
  readonly x: number;
  /** y component of the point. */
  readonly y: number;
}

/**
 * Create an instance of a {@link Point}
 *
 * @param point - Point constructor data
 * @returns point instance
 */
export function create(point: Point): Point {
  return copy(point);
}

export function fromPx({
  x,
  y,
  cellSize,
}: Point & { cellSize: number }): Point {
  if (cellSize === 0) return { x, y };

  const pxToCells = (px: number) => Math.floor(px / cellSize);
  return create({ x: pxToCells(x), y: pxToCells(y) });
}

export function distance(b: Point) {
  return (a: Point): vector.Vector2d => {
    const diff = difference(a, b);

    return vector.create({
      x: Math.abs(diff.x),
      y: Math.abs(diff.y),
    });
  };
}

/**
 * Translate a point across two-dimensional space.
 *
 * @param displacementVector
 * @returns point instance
 */
export function translate(displacementVector: vector.Vector2d) {
  return (point: Point): Point => {
    return create({
      x: point.x + displacementVector.x,
      y: point.y + displacementVector.y,
    });
  };
}

export function difference(a: Point, b: Point): Point {
  return {
    x: a.x - b.x,
    y: a.y - b.y,
  };
}

/**
 * Scale a point.
 *
 * @param magnification - magnification factors
 * @param point - point instance to be magnified
 * @returns point instance
 */
export function scale(
  magnification: number | vector.Vector2d,
  point: Point
): Point {
  if (typeof magnification === 'number') {
    return create({
      ...point,
      x: point.x * magnification,
      y: point.y * magnification,
    });
  }

  const DEFAULT_MAGNIFICATION = 1;
  const xMag = magnification.x ?? DEFAULT_MAGNIFICATION;
  const yMag = magnification.y ?? DEFAULT_MAGNIFICATION;

  return create({ ...point, x: point.x * xMag, y: point.y * yMag });
}
