import { createRectangle } from '#grid/rectangle/create';
import invariant from 'tiny-invariant';
import type { Rectangle } from './types';

/**
 * Create a new rectangle by placing one rectangle within another.
 *
 * @remarks The container rectangle must be at least as large as the rectangle
 * it is containing.
 */
export function placeWithinRectangle(
  rectangle: Rectangle,
  container: Rectangle
): Rectangle {
  invariant(
    rectangle.height > 0 && rectangle.width > 0,
    'Expected valid rectangle dimensions.'
  );
  invariant(
    container.height > 0 && container.width > 0,
    'Expected valid container dimensions.'
  );
  invariant(
    container.height >= rectangle.height && container.width >= rectangle.width,
    'Expected container to be large enough to fit the rectangle.'
  );

  const maxXPos = container.width - rectangle.width;
  const maxYPos = container.height - rectangle.height;

  return createRectangle(
    {
      x: Math.min(rectangle.x, maxXPos),
      y: Math.min(rectangle.y, maxYPos),
      height: Math.min(rectangle.height, container.height),
      width: Math.min(rectangle.width, container.width),
    },
    { round: true }
  );
}
