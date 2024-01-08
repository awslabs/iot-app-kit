import type { Primitive } from '@iot-app-kit/core';

/**
 * Rounds a number to a pre-determined precision
 *
 * i.e. round(100000.1234) => 100000.1234
 *      round(100000.12345678) => 100000.1234
 *      round(.02345678) => 0.02346
 */
export const round = (num: number, precision = 4): number => {
  if (
    Number.isNaN(num) ||
    num === Infinity ||
    num === -Infinity ||
    precision <= 0
  ) {
    return num;
  }

  if (Math.abs(num) < 1) {
    return Number(num.toPrecision(precision));
  }

  const integer = Math.trunc(num);
  const decimal = num - integer;
  return Number(
    (integer + Number(decimal.toFixed(precision))).toFixed(precision)
  );
};

/**
 * Checks if value can be used as a number
 */
export const isNumeric = (value: Primitive): value is number =>
  /^(\+|-)?(Infinity|\d+)(\.\d+)?e?((\+|-)?\d+)?$/.test(String(value));
