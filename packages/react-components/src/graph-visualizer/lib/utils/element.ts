import { isArray, isNotNil, isPlainObject, isString } from './lang';

export type ClassName = string | string[] | Record<string, boolean> | null | undefined;

/**
 * Returns a normalized class name from arguments of type `ClassName`.
 */
export function createClassName(...args: ClassName[]) {
  const SEPARATOR = ' ';
  return args
    .filter(isNotNil)
    .reduce<string>((accum, arg) => {
      accum += SEPARATOR;

      if (isString(arg)) {
        accum += `${arg}`;
      }

      if (isArray(arg)) {
        accum += `${arg.join(SEPARATOR)}`;
      }

      if (isPlainObject(arg)) {
        accum += `${Object.entries(arg)
          .reduce<string[]>((accum, [key, value]) => {
            if (value) {
              accum.push(key);
            }
            return accum;
          }, [])
          .join(SEPARATOR)}`;
      }

      return accum;
    }, '')
    .trim();
}
