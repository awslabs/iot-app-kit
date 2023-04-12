import { Locator, Page } from '@playwright/test';
import zip from 'lodash/zip';
import { isDefined } from '../../../src/util/isDefined';

type Point = [number, number];

const center = (box: { x: number; y: number; height: number; width: number }): [x: number, y: number] => [
  box.x + box.width / 2,
  box.y + box.height / 2,
];

const subdivide = (arr: Point[]) => {
  if (arr.length <= 1) return arr;
  const grouped: Point[][] = [];
  for (let i = 0; i < arr.length - 1; i++) {
    grouped.push([arr[i], arr[i + 1]]);
  }
  const divided = grouped.map(([a, b]: Point[]): Point => {
    const [ax, ay] = a;
    const [bx, by] = b;

    const mx = (ax + bx) / 2;
    const my = (ay + by) / 2;
    return [mx, my];
  });
  return zip(arr, divided).flat().filter(isDefined);
};

const interpolate = (arr: Point[], splits: number) => {
  let interpolated: Point[] = arr;
  for (let n = 0; n < splits; n++) {
    interpolated = subdivide(interpolated);
  }
  return interpolated;
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
export const dragAndDrop = (page: Page) => (from: Locator) => ({
  dragTo: async (to: Locator) => {
    const fromBb = await from.boundingBox();
    const toBb = await to.boundingBox();

    if (!fromBb || !toBb) throw new Error('could not get dimensions for locators');

    const fromPoint = center(fromBb);
    const toPoint = center(toBb);

    const points = interpolate([fromPoint, toPoint], 2);
    const [first, ...rest] = points;

    await page.mouse.move(...first);
    await page.mouse.down({ button: 'left' });

    for (const p of rest) {
      await page.mouse.move(...p);
    }
    await page.mouse.up({ button: 'left' });
  },
});
