import parseColor from 'color';

const LOW_LIGHTNESS_COLOR = 'white';
const HIGH_LIGHTNESS_COLOR = 'black';

/**
 * Return a color which has good contrast against the inputted color.
 *
 * @para backgroundColor - any valid css text string, i.e. 'red' or '#ff0000'
 */
export const highContrastColor = (backgroundColor: string): string => {
  try {
    return parseColor(backgroundColor).isLight() ? HIGH_LIGHTNESS_COLOR : LOW_LIGHTNESS_COLOR;
  } catch (err) {
    // Invalid color string was likely passed into `color`.
    /* eslint-disable-next-line no-console */
    console.error(err);
  }
  return LOW_LIGHTNESS_COLOR;
};
