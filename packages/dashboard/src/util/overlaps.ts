import type { Rectangle } from '~/types';

/**
 * @param a - a rectangle
 * @param b - a rectangle
 * @returns whether or not the 2 rectangles a & b overlap
 *
 * Allows for either rectangle to be formed with side length 0 (no area).
 * Considers 2 points in the same location as overlapping.
 */
export const overlaps = (a: Rectangle, b: Rectangle): boolean => {
  // no horizontal overlap
  // compares the left side of one rectangle to the right side (x + width) of the other
  if (a.x > b.x + b.width || b.x > a.x + a.width) return false;

  // no vertical overlap
  // compares the top side of one rectangle to the bottom side (y + height) of the other
  if (a.y > b.y + b.height || b.y > a.y + a.height) return false;

  return true;
};
