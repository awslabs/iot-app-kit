import { Primitive } from '@synchro-charts/core';

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

  const integer = Math.trunc(absoluteValue);
  const decimal = (absoluteValue - integer).toFixed(MAX_PRECISION).substring(2);

  const negativeSign = num === absoluteValue ? '' : '-';
  return Number(`${negativeSign}${integer}.${decimal}`);
};

/**
 * Checks if value can be used as a number
 */
export const isNumeric = (value: Primitive): boolean =>
  /^(\+|-)?(Infinity|\d+)(\.\d+)?e?((\+|-)?\d+)?$/.test(String(value));
