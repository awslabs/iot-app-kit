/* eslint-disable @typescript-eslint/ban-types */

//will revisit this file again this is not final, this is leveraged as is from CookieFactory code.
type Primitive = number | string | boolean | bigint | symbol | null | undefined;

export function isEven(value: number) {
  return (~value & 1) === 1;
}

export function isOdd(value: number) {
  return (value & 1) === 1;
}

export function isArray(value: any): value is any[] {
  return Array.isArray(value);
}

export function isBoolean(value: any): value is boolean {
  return !isNil(value) && (typeof value === 'boolean' || value instanceof Boolean);
}

export function isDefined<T>(value: T): value is Exclude<T, undefined> {
  return value !== undefined;
}

/**
 * Checks if `value` is a  DOM element.
 */
export function isElement(value: any): value is HTMLElement {
  return value instanceof HTMLElement;
}

export function isFunction(value: any): value is Function {
  return !isNil(value) && typeof value === 'function';
}

export function isNil(value: any): value is null | undefined {
  return value == undefined;
}

export function isNotNil<T>(value: T): value is Exclude<T, null | undefined> {
  return value != undefined;
}

export function isNotNull<T>(value: T): value is Exclude<T, null> {
  return value !== null;
}

export function isNull(value: any): value is null {
  return value === null;
}

export function isNumber(value: any): value is number {
  return !isNil(value) && (typeof value === 'number' || value instanceof Number);
}

export function isPlainObject<T>(value: T): value is Exclude<T, Array<any> | Function | symbol | Primitive> {
  return !isNil(value) && typeof value === 'object' && (value as Object).constructor.name === 'Object';
}

export function isString(value: any): value is string {
  return !isNil(value) && (typeof value === 'string' || value instanceof String);
}

export function isSvgElement(value: any): value is SVGElement {
  return value instanceof SVGElement;
}

export function isUndefined(value: any): value is undefined {
  return value === undefined;
}
