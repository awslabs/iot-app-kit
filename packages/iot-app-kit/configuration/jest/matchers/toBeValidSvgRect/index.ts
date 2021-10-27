import { matcherHint } from 'jest-matcher-utils';

const validNumber = (value: unknown): boolean => !Number.isNaN(value as number);

const predicate = (el: SVGGElement) => {
  const width = el.getAttribute('width');
  const height = el.getAttribute('height');
  const x = el.getAttribute('x');
  const y = el.getAttribute('y');
  return (
    (width == null || validNumber(width)) &&
    (height == null || validNumber(height)) &&
    (x == null || validNumber(x)) &&
    (y == null || validNumber(y)) &&
    (width == null || Number.parseFloat(width as string) >= 0) &&
    (height == null || Number.parseFloat(height as string) >= 0)
  );
};

const passMessage = (el: SVGGElement) => () =>
  `${matcherHint('.not.toBeValidSvg', 'received', '')}\n\n` +
  'Expected the element to not to be a valid svg but received the attributes' +
  `{ x: ${el.getAttribute('x')}, y: ${el.getAttribute('y')}, width: ${el.getAttribute(
    'width'
  )}, height: ${el.getAttribute('height')}`;

const failMessage = (el: SVGGElement) => () =>
  `${matcherHint('.toBeNearDate', 'received', '')}\n\n` +
  'Expected the element to be a valid svg rect but received the attributes' +
  `{ x: ${el.getAttribute('x')}, y: ${el.getAttribute('y')}, width: ${el.getAttribute(
    'width'
  )}, height:  ${el.getAttribute('height')}`;

export const toBeValidSvgRect = {
  /**
   * Returns whether an element is a valid svg rect
   *
   * @param {SVGGElement} el
   * @returns {{pass: boolean, message: *}}
   */
  toBeValidSvgRect: (el: SVGGElement) => {
    const pass = predicate(el);
    return { pass, message: pass ? passMessage(el) : failMessage(el) };
  },
};
