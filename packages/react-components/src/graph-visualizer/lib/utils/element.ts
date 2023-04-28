export type ClassName = string | string[] | Record<string, boolean> | null | undefined;

/**
 * Returns a normalized class name from arguments of type `ClassName`.
 */
export function createClassName(...args: ClassName[]) {
  const SEPARATOR = ' ';
  return args
    .filter((item) => !!item)
    .reduce<string>((accum, arg) => {
      accum += SEPARATOR;

      if (typeof arg === 'string') {
        accum += arg;
        return accum;
      }

      if (Array.isArray(arg)) {
        accum += arg.join(SEPARATOR);
        return accum;
      }

      const obj = arg as Record<string, boolean>;
      accum += `${Object.entries(obj)
        .reduce<string[]>((accum, [key, value]) => {
          if (value) {
            accum.push(key);
          }
          return accum;
        }, [])
        .join(SEPARATOR)}`;

      return accum;
    }, '')
    .trim();
}
