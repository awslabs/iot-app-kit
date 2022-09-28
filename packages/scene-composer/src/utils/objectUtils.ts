import shallow from 'zustand/shallow';

/**
 * Check if it is an object.
 */
export function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Recursively merge sources to target.
 */
export function mergeDeep(target: any, ...sources: any[]): any {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}

export function shallowEquals(a: any, b: any): boolean {
  return shallow(a, b);
}

export function shallowEqualsArray(a: any[], b: any[]): boolean {
  if ((!a && b) || (!b && a)) return false;
  if (a.length !== b.length) return false;

  for (let index = 0; index < a.length; index++) {
    if (!shallow(a[index], b[index])) return false;
  }
  return true;
}

/**
 * Returns a function that append a function call after the original function.
 *
 * @param fn original function
 * @param extra extra function to call after the original function completes
 * @returns original function's result
 */
export function appendFunction(fn: Function | undefined, extra: Function) {
  return (...args: any[]) => {
    const res = fn ? fn(...args) : undefined;
    extra(...args);
    return res;
  };
}
