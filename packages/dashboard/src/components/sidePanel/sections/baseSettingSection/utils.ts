/**
 * Widgets can only be 2x2 to 100x100. This function checks if the value is within that range.
 */
export function isValidWidgetDimension(value: number) {
  return value >= 2 && value <= 100;
}

/**
 * Parses a string to an integer and returns 0 if the value is NaN.
 */
export function nonNaNParseInt(value: string) {
  const parsedValue = parseInt(value);

  return isNaN(parsedValue) ? 0 : parsedValue;
}
