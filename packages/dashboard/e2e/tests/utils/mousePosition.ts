import { type BoundingBox } from './locator';

/**
 *
 * @param box bounding box
 * @returns the midpoint of the bounding box
 */
export const center = (box: BoundingBox): [x: number, y: number] => [
  box.x + box.width / 2,
  box.y + box.height / 2,
];

/**
 *
 * @param box bounding box
 * @returns the midpoint of the bounding box
 */
export const topCenter = (box: BoundingBox): [x: number, y: number] => [
  box.x + box.width / 2,
  box.y + 10,
];
