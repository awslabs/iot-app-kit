import {
  colorChartsBlue1500,
  colorChartsBlue2300,
  colorChartsGreen500,
  colorChartsOrange300,
  colorChartsOrange600,
  colorChartsPink500,
  colorChartsPink800,
  colorChartsPurple500,
  colorChartsRed300,
  colorChartsRed500,
  colorChartsStatusNeutral,
  colorChartsTeal300,
  colorChartsTeal600,
  colorChartsYellow700,
} from '@cloudscape-design/design-tokens';

import { hexColorFromDesignToken } from '../../../../../../utils/styleUtils';

export const palleteColors = {
  blue: hexColorFromDesignToken(colorChartsBlue1500 || '#08aad2'),
  red: hexColorFromDesignToken(colorChartsRed300 || '#d63f38'),
  softRed: hexColorFromDesignToken(colorChartsRed500 || '#fe6e73'),
  orange: hexColorFromDesignToken(colorChartsOrange600 || '#f89256'),
  yellow: hexColorFromDesignToken(colorChartsYellow700 || '#dfb52c'),
  softGreen: hexColorFromDesignToken(colorChartsGreen500 || '#69ae34'),
  grey: hexColorFromDesignToken(colorChartsStatusNeutral || '#879596'),
  pink: hexColorFromDesignToken(colorChartsPink500 || '#e07f9d'),
  lightPink: hexColorFromDesignToken(colorChartsPink800 || '#ffb0c8'),
  paletteBlue: hexColorFromDesignToken(colorChartsBlue2300 || '#486de8'),
  purple: hexColorFromDesignToken(colorChartsPurple500 || '#b088f5'),
  darkOrange: hexColorFromDesignToken(colorChartsOrange300 || '#c55305'),
  teal: hexColorFromDesignToken(colorChartsTeal300 || '#018977'),
  softTeal: hexColorFromDesignToken(colorChartsTeal600 || '#40bfa9'),
};
