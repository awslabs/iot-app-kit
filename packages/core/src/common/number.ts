import type { Primitive } from '@iot-app-kit/helpers';

const MAX_PRECISION = 4;

/**
 * Rounds a number to a pre-determined precision
 *
 * i.e. round(100000.1234) => 100000.1234
 *      round(100000.12345678) => 100000.1234
 *      round(.02345678) => 0.02346
 */
export const round = (num: number): number => {
  if (Number.isNaN(num) || num === Infinity || num === -Infinity) {
    return num;
  }

  const absoluteValue = Math.abs(num);
  if (absoluteValue < 1) {
    return Number(num.toPrecision(MAX_PRECISION));
  }

  const integer = Math.trunc(num);
  // in case of negative number, we need to remove the first 3 characters from decimal string eg. -0.123 => 123
  const decimal = (num - integer)
    .toFixed(MAX_PRECISION)
    .substring(num !== absoluteValue ? 3 : 2);

  return Number(`${integer}.${decimal}`);
};

/**
 * Checks if value can be used as a number
 */
export const isNumeric = (value: Primitive): boolean =>
  /^(\+|-)?(Infinity|\d+)(\.\d+)?e?((\+|-)?\d+)?$/.test(String(value));
