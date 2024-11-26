import { type Locator, type Page } from '@playwright/test';
import zip from 'lodash/zip.js';
import { type BoundingBox, getBoundingBox } from './locator';
import { center } from './mousePosition';

export type Point = [number, number];

/**
 *
 * @param box
 * @param offset
 * @returns a point tuple offset from the bounding box top left
 *
 */
const toPointTuple = ({
  x,
  y,
}: {
  x: number;
  y: number;
}): [x: number, y: number] => [x, y];

/**
 *
 * used to prepare points for subdividing
 *
 * @param points
 * @returns returning a pairing of each point to be used for easily subdividing them
 */
const pairPoints = (points: Point[]): Point[][] => {
  // Nothing to pair
  if (points.length <= 1) return [];

  const grouped: Point[][] = [];
  for (let i = 0; i < points.length - 1; i++) {
    grouped.push([points[i], points[i + 1]]);
  }
  return grouped;
};

/**
 *
 * @param pointPairing - [Point, Point]
 * @returns A point at the midpoint of the pairing
 */
const midPointFromPair = ([a, b]: Point[]): Point => {
  const [ax, ay] = a;
  const [bx, by] = b;

  const mx = (ax + bx) / 2;
  const my = (ay + by) / 2;
  return [mx, my];
};

/**
 *
 * An algorithm that will inject a new point at the midpoint of each pair of points
 *
 * eg. (if points were 1 dimensional) [1, 2, 3, 4, 5] -> [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]
 *
 * This will be used to break apart a mouse movement into more discrete movements
 * so that it behaves more like an actual users mouse instead of teleporting from 1 place to the next.
 *
 * @param arr
 * @returns
 */
const subdivide = (points: Point[]) => {
  if (points.length <= 1) return points;
  const midPointsOfPairs = pairPoints(points).map(midPointFromPair);
  // Interleave the original list with the mid points of the pair
  // Remove any undefined entries as the result of interleaving
  return zip(points, midPointsOfPairs)
    .flat()
    .filter((p) => p != null);
};

/**
 *
 * @param points - a list of points to subdivide into additional points inbetween them
 * @param splits - how many subdivisions to run
 * @returns a subdivided list of points
 *
 * eg. (if points were 1 dimensional) interpolate([1, 5], 2) -> (1st iteration) [1,3,5] -> (2nd iteration) -> [1,2,3,4,5]
 *
 */
const interpolate = (points: Point[], splits: number) => {
  let interpolated: Point[] = points;
  for (let n = 0; n < splits; n++) {
    interpolated = subdivide(interpolated);
  }
  return interpolated;
};

export type DragPosition = ({
  source,
  target,
}: {
  source: BoundingBox;
  target: BoundingBox;
}) => {
  x: number;
  y: number;
};
export type DragToOptions = {
  /**
   * Clicks on the source element at this point relative to the top-left corner of the element's padding box. If not
   * specified, the center is used.
   */
  sourcePosition?: DragPosition;
  /**
   * Drops on the target element at this point relative to the top-left corner of the element's padding box. If not
   * specified, the center is used.
   */
  targetPosition?: DragPosition;
};

export type DragGenerator = (from: Locator) => {
  dragTo: (to: Locator, options?: DragToOptions) => Promise<void>;
};
/**
 * Drag and Drop utility
 *
 * Used to create draggable instances of locators and click drag them to another locator
 *
 * Currently this drags and drops one locator to the next from the midpoints of both locators.
 * This function interpolates additional points inbetween the from and to locations.
 * This is to get around an issue where the mouse magically jumps from one point to another.
 * That "jumping" would not cause the right events to fire within the React DnD hooks.
 *
 */
export const dragAndDrop =
  (page: Page): DragGenerator =>
  (from: Locator) => ({
    dragTo: async (to: Locator, options?: DragToOptions) => {
      const { sourcePosition, targetPosition } = options || {};

      const fromBb = await getBoundingBox(from);
      const toBb = await getBoundingBox(to);

      const fromPoint = sourcePosition
        ? toPointTuple(sourcePosition({ source: fromBb, target: toBb }))
        : center(fromBb);
      const toPoint = targetPosition
        ? toPointTuple(targetPosition({ source: fromBb, target: toBb }))
        : center(toBb);

      const points = interpolate([fromPoint, toPoint], 2);
      const [firstPoint, ...interpolatedPoints] = points;

      await page.mouse.move(...firstPoint);
      await page.mouse.down({ button: 'left' });

      for (const point of interpolatedPoints) {
        await page.mouse.move(...point);
      }
      await page.mouse.up({ button: 'left' });
    },
  });
