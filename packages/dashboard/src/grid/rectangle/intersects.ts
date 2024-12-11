import type { Rectangle } from '#grid/rectangle/types';
import type { Rectangle as OldRectangle } from '../../types';

/**
 * @param a - a rectangle
 * @param b - a rectangle
 * @returns whether or not the 2 rectangles a & b overlap
 *
 * Allows for either rectangle to be formed with side length 0 (no area).
 * Considers 2 points in the same location as overlapping.
 */
export const overlaps = (a: OldRectangle, b: OldRectangle): boolean => {
  // no horizontal overlap
  // compares the left side of one rectangle to the right side (x + width) of the other
  if (a.x > b.x + b.width || b.x > a.x + a.width) return false;

  // no vertical overlap
  // compares the top side of one rectangle to the bottom side (y + height) of the other
  if (a.y > b.y + b.height || b.y > a.y + a.height) return false;

  return true;
};

/**
 * Determine if two rectangles intersect on this grid. Overlap of edges and
 * corners is considered an intersection.
 *
 * @remarks
 *
 * Point 1 is the top-left position of the rectangle (i.e., its position on
 * the grid). Point 2 is the bottom-right position of the rectangle.
 *
 * 1-------+
 * |       |
 * |   1---|---+
 * |   |   |   |
 * +-------2   |
 *     |       |
 *     +-------2
 */
export function intersects(a: Rectangle, b: Rectangle): boolean {
  const aTopLeft = { x: a.x, y: a.y };
  const aBottomRight = { x: aTopLeft.x + a.width, y: aTopLeft.y + a.height };
  const bTopLeft = { x: b.x, y: b.y };
  const bBottomRight = { x: bTopLeft.x + b.width, y: bTopLeft.y + b.height };

  if (aTopLeft.x > bBottomRight.x || bTopLeft.x > aBottomRight.x) return false;
  if (aTopLeft.y > bBottomRight.y || bTopLeft.y > aBottomRight.y) return false;

  return true;
}
