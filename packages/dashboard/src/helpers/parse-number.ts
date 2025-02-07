/**
 * Safely parse a string to a number.
 */
export function parseNumber(
  value: string | number | undefined
): number | undefined {
  const parsed = Number(value);

  return isNaN(parsed) ? undefined : parsed;
}

export function parseIfNumber(
  value: string | number | undefined
): number | string | undefined {
  return parseNumber(value) ?? value;
}
