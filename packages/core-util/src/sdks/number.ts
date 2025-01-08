import type { Primitive } from '@iot-app-kit/helpers';

/**
 * Rounds a number to a given precision
 *
 * i.e. round(100000.1234, 4) => 100000.1234
 *      round(100000.12345678, 4) => 100000.1234
 *      round(.02345678, 2) => 0.02
 *      round(100000.12345678) => 100000.12345678
 *
 * Must be represented as a string to not lose trailing zeros.
 */
export const round = (num: number, precision?: number): string => {
  if (
    Number.isNaN(num) ||
    num === Infinity ||
    num === -Infinity ||
    precision === undefined
  ) {
    return num.toString();
  }

  return num.toFixed(precision);
};

/**
 * Checks if value can be used as a number
 */
export const isNumeric = (value: Primitive): value is number =>
  /^(\+|-)?(Infinity|\d+)(\.\d+)?e?((\+|-)?\d+)?$/.test(String(value));
