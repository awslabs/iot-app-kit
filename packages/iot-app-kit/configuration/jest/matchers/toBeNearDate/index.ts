import { matcherHint } from 'jest-matcher-utils';

const DEFAULT_THRESHOLD_MS = 60 * 1000; // One Minute

const predicate = (a: Date, b: Date, withinMS: number) => {
  return Math.abs(a.getTime() - b.getTime()) < withinMS;
};

const passMessage = (a: Date, b: Date) => () =>
  `${matcherHint('.not.toBeNearDate', 'received', '')}\n\n` +
  'Expected the given dates to not be close to each other, but the two dates were within:' +
  ` ${Math.abs((a.getTime() - b.getTime()) / 1000)} seconds`;

const failMessage = (a: Date, b: Date) => () =>
  `${matcherHint('.toBeNearDate', 'received', '')}\n\n` +
  'Expected the given dates to be close to each other but the two dates were :' +
  ` ${Math.abs((a.getTime() - b.getTime()) / 1000)} seconds in distance`;

export const toBeNearDate = {
  /**
   * Returns whether two dates are near
   *
   * @param dateA {Date | string}
   * @param dateB {Date | string}
   * @param withinMS {number}
   * @returns {{pass: boolean, message: *}}
   */
  toBeNearDate: (dateA: Date | string, dateB: Date | string, withinMS: number) => {
    // Support iso formatted strings
    const a = typeof dateA === 'string' ? new Date(dateA) : dateA;
    const b = typeof dateB === 'string' ? new Date(dateB) : dateB;
    const pass = predicate(a, b, withinMS || DEFAULT_THRESHOLD_MS);
    return { pass, message: pass ? passMessage(a, b) : failMessage(a, b) };
  },
};
