/**
 * Assign implements the spec for `Object.assign` with a more strict type assurance.
 * `Object.assign` is defined as `(target: T, source: U) => T & U`.
 * This results in it allowed any two types.
 *
 * For certain situations where we wish to ensure that T maintains it's type rather
 * than mutating types. This is the reason for this helper function.
 */
export const update = <T>(target: T, source: Partial<T>): T => Object.assign(target, source);
