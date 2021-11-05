import { BoundingBox } from 'puppeteer';

const isOverlapping = (rect1: BoundingBox, rect2: BoundingBox) => {
  const rect1Top = rect1.y;
  const rect1Bottom = rect1.y + rect1.height;
  const rect1Left = rect1.x;
  const rect1Right = rect1.x + rect1.width;

  const rect2Top = rect2.y;
  const rect2Bottom = rect2.y + rect2.height;
  const rect2Left = rect2.x;
  const rect2Right = rect2.x + rect2.width;

  return !(rect1Right < rect2Left || rect1Left > rect2Right || rect1Bottom < rect2Top || rect1Top > rect2Bottom);
};

const passMessage = 'Elements do not overlap';

const failMessage = 'Elements overlap each other';

export const toNotOverlap = {
  /**
   * Returns whether an element overlaps another element
   *
   * @param {BoundingBox} el1
   * @param {BoundingBox} el2
   *
   * @returns{{pass: boolean, message: *}}
   */

  toNotOverlap: (el1: BoundingBox, el2: BoundingBox) => {
    const pass = !isOverlapping(el1, el2);

    return { pass, message: pass ? () => passMessage : () => failMessage };
  },
};
