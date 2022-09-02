import {
  colorChartsYellow700,
  colorForegroundControlDefault,
  colorBackgroundNotificationBlue,
  colorTextNotificationDefault,
  colorBackgroundNotificationRed,
  colorBorderButtonNormalDefault,
} from '@awsui/design-tokens';

const designTokenRegex = /^var\(([0-9a-zA-Z-]+),\s*(#[0-9a-z]+)\)$/;

/**
 * extract css hex color value from design token.
 *
 * @param designToken the design token
 * @returns the hex color extracted from the design token
 */
export function hexColorFromDesignToken(designToken: string): string {
  const match = designToken.match(designTokenRegex);
  if (!match) return '#000000';
  const varName = match[1];
  const defaultValue = match[2];

  return getComputedStyle(document.body).getPropertyValue(varName) || defaultValue;
}

// Prefer the values to be stripped out of the style provided by AWSUI. Default values are backups of the current values.
export const colors = {
  infoBlue: hexColorFromDesignToken(colorBackgroundNotificationBlue || '#0073bb'),
  warnYellow: hexColorFromDesignToken(colorChartsYellow700 || '#dfb52c'),
  errorRed: hexColorFromDesignToken(colorBackgroundNotificationRed || '#d13212'),
  selectedOrange: '#ec7211', // cannot use colorTextAccent since it is blue for external AWSUI lib
  infoRingWhite: hexColorFromDesignToken(colorTextNotificationDefault || '#fafafa'),
  symbolWhite: hexColorFromDesignToken(colorForegroundControlDefault || '#fafafa'),
  containerBorderWhite: hexColorFromDesignToken(colorBorderButtonNormalDefault || '#fafafa'),
};
