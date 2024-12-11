import * as point from './point';
import * as vector from './vector';
import type { PartialDeep } from 'type-fest';
import { copy } from '@iot-app-kit/helpers/objects/copy';

/**
 * Rectangle placed in a three-dimensional space with an inverted y axis.
 */
export interface Rectangle {
  /** Position of the top-left corner of the rectangle. */
  min: point.Point;
  /** Position of the bottom-right corner of the rectangle. */
  max: point.Point;
  /** Position of the rectangle along the z-axis. */
  z: number;
}

/**
 * Create an instance of a {@link Rectangle}
 *
 * @param rectangle - Rectangle constructor data
 * @returns rectangle instance
 */
export function create(rectangle: Rectangle): Rectangle {
  return copy(rectangle);
}

/**
 * Calculate the width of a rectangle.
 *
 * @param rectangle - {@link Rectangle} instance
 * @returns width of the rectangle
 */
export function width(rectangle: Rectangle): number {
  return rectangle.max.x - rectangle.min.x;
}

/**
 * Calculate the height of a rectangle.
 *
 * @param rectangle - {@link Rectangle} instance
 * @returns height of the rectangle
 */
export function height(rectangle: Rectangle): number {
  return rectangle.max.y - rectangle.min.y;
}

/**
 * Scale the dimensions of a rectangle.
 *
 * @param magnification
 * @param rectangle - {@link Rectangle} instance
 * @returns rectangle instance
 */
export function scale(
  magnification: number | vector.Vector2D,
  rectangle: Rectangle
): Rectangle {
  return create({
    ...rectangle,
    // Rectangle is anchored by the min point
    min: rectangle.min,
    max: point.scale(magnification, rectangle.max),
  });
}

/**
 * Translate a rectangle in three-dimensional space.
 *
 * @param displacementVector
 * @param rectangle
 * @returns rectangle instance
 */
export function translate3d(
  displacementVector: vector.Vector,
  rectangle: Rectangle
): Rectangle {
  return create({
    min: point.translate(rectangle.min, displacementVector),
    max: point.translate(rectangle.max, displacementVector),
    z: rectangle.z + displacementVector.z,
  });
}

/**
 * Resize a rectangle in two-dimensional space.
 */
export function resize(
  dimensions: PartialDeep<Rectangle>,
  rectangle: Rectangle
): Rectangle {
  return create({
    ...rectangle,
    min: point.create({
      x: dimensions.min?.x ?? rectangle.min.x,
      y: dimensions.min?.y ?? rectangle.min.y,
    }),
    max: point.create({
      x: dimensions.max?.x ?? rectangle.max.x,
      y: dimensions.max?.y ?? rectangle.max.y,
    }),
  });
}

export function surround(rectangles: Rectangle[]): Rectangle {
  if (rectangles.length === 0) {
    return create({ min: { x: 0, y: 0 }, max: { x: 0, y: 0 } });
  }

  return rectangles.reduce((acc, curr) => {
    return {
      min: {
        x: Math.min(acc.min.x, curr.min.x),
        y: Math.min(acc.min.y, curr.min.y),
      },
      max: {
        x: Math.max(acc.max.x, curr.max.x),
        y: Math.max(acc.max.y, curr.max.y),
      },
    };
  }, create({ min: { x: 0, y: 0 }, max: { x: 0, y: 0 } }));
}

export function transformOld(
  rectangle: Rectangle,
  options: {
    offset?: { x?: number; y?: number };
    scale?: { x?: number; y?: number };
  } = {}
): Rectangle {
  const {
    offset: { x: offsetX = 0, y: offsetY = 0 } = {},
    scale: { x: scaleX = 1, y: scaleY = 1 } = {},
  } = options;
  const minX = rectangle.min.x + offsetX * scaleX;
  const minY = rectangle.min.y + offsetY * scaleY;
  const maxX = minX + width(rectangle) * scaleX;
  const maxY = minY + height(rectangle) * scaleY;

  return {
    min: {
      x: minX,
      y: minY,
    },
    max: {
      x: maxX,
      y: maxY,
    },
  };
}

export function transformWith(
  a: Rectangle,
  b1: Rectangle,
  b2: Rectangle
): Rectangle {
  return transform(a, {
    offset: {
      x: b2.min.x - b1.min.x,
      y: b2.min.y - b1.min.y,
    },
    scale: {
      x: width(b2) / width(b1),
      y: height(b2) / height(b1),
    },
  });
}

export function isWithin(rectangle: Rectangle, container: Rectangle): boolean {
  return (
    isBetweenHorizontal(rectangle, container) &&
    isBetweenVertical(rectangle, container)
  );
}

function isBetweenHorizontal(
  rectangle: Rectangle,
  container: Rectangle
): boolean {
  return (
    rectangle.min.x >= container.min.x && rectangle.max.x <= container.max.x
  );
}

function isBetweenVertical(
  rectangle: Rectangle,
  container: Rectangle
): boolean {
  return (
    rectangle.min.y >= container.min.y && rectangle.max.y <= container.max.y
  );
}

export function contain(container: Rectangle, rectangle: Rectangle): Rectangle {
  let r = copy(rectangle);

  if (!isBetweenHorizontal(r, container)) {
    if (width(r) >= width(container)) {
      // Span rectangle across container x-axis.
      r = resize(
        {
          min: { x: container.min.x },
          max: { x: container.max.x },
        },
        r
      );
    } else {
      r = translate3d(
        vector.create({
          x:
            r.max.x > container.max.x
              ? point.difference(container.max, r.max).x
              : point.difference(container.min, r.min).x,
          y: 0,
        }),
        r
      );
    }
  }

  if (!isBetweenVertical(r, container)) {
    if (height(r) >= height(container)) {
      // Span rectangle across container y-axis.
      r = resize(
        {
          min: { y: container.min.y },
          max: { y: container.max.y },
        },
        r
      );
    } else {
      r = translate(
        vector.create({
          x: 0,
          y:
            r.max.y > container.max.y
              ? point.difference(container.max, r.max).y
              : point.difference(container.min, r.min).y,
        }),
        r
      );
    }
  }

  return r;
}

export function relativeScale(
  a: Rectangle,
  b: Rectangle
): { x: number; y: number } {
  return {
    x: width(a) / width(b),
    y: height(a) / height(b),
  };
}

export function isOverlapping(b: Rectangle, a: Rectangle): boolean {
  if (isWithin(a, b)) return true;

  if (
    a.min.x > b.max.x ||
    b.min.x > a.max.x ||
    a.min.y > b.max.y ||
    b.min.y > a.max.y
  )
    return false;

  return true;
}

type Transformer = (rectangle: Rectangle) => Rectangle;

export function transform(transformers: Transformer[]) {
  return (rectangle: Rectangle): Rectangle => {
    return transformers.reduce((r, transformer) => {
      return transformer(r);
    }, rectangle);
  };
}
