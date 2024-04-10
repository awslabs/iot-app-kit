/**
 * This method uses a regular expression (`hexRegex`) to validate a hex color code.
 * The regex checks if the hex code starts with a "#" symbol, followed by either a
 * 6-digit combination of characters from A-F, a-f, and 0-9.
 * The `test` method is then used to validate the `hexCode` against the regex pattern.
 * @param hexCode
 * @returns
 */
export const isValidHexCode = (hexCode: string): boolean => {
  const hexRegex = /^#([A-Fa-f0-9]{6})$/;
  return hexRegex.test(hexCode);
};
