export const isDefined = <T>(value: T | null | undefined): value is T =>
  value != null;

export const isNumber = <T>(val: T | number): val is number =>
  typeof val === 'number';

export const isString = <T>(val: T | string): val is string =>
  typeof val === 'string';
