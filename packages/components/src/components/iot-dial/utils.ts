import { BaseStyleSettings } from '@iot-app-kit/core';

export const FONT_SIZE = {
  xxSmall: 14,
  xSmall: 16,
  small: 20,
  smaller: 24,
  medium: 32,
  large: 48,
  larger: 60,
  xLarger: 96,
};

export const LINE_THICKNESS = {
  xSmall: 8,
  small: 10,
  medium: 15,
  large: 30,
  larger: 36,
  xLarger: 50,
};

export const BOX = {
  xSmall: 75,
  small: 100,
  medium: 150,
  large: 200,
  larger: 300,
  xLarger: 500,
};

export const DIAL_SIZE_CONFIG = {
  XXL: {
    fontSize: FONT_SIZE.xLarger,
    dialThickness: LINE_THICKNESS.xLarger,
    iconSize: FONT_SIZE.xLarger,
    labelSize: FONT_SIZE.large,
    unitSize: FONT_SIZE.large,
    width: BOX.xLarger,
  },
  XL: {
    fontSize: FONT_SIZE.larger,
    dialThickness: LINE_THICKNESS.larger,
    iconSize: FONT_SIZE.large,
    labelSize: FONT_SIZE.medium,
    unitSize: FONT_SIZE.medium,
    width: BOX.larger,
  },
  L: {
    fontSize: FONT_SIZE.large,
    dialThickness: LINE_THICKNESS.large,
    iconSize: FONT_SIZE.large,
    labelSize: FONT_SIZE.smaller,
    unitSize: FONT_SIZE.smaller,
    width: BOX.large,
  },
  M: {
    fontSize: FONT_SIZE.medium,
    dialThickness: LINE_THICKNESS.medium,
    iconSize: FONT_SIZE.medium,
    labelSize: FONT_SIZE.small,
    unitSize: FONT_SIZE.small,
    width: BOX.medium,
  },
  S: {
    fontSize: FONT_SIZE.smaller,
    dialThickness: LINE_THICKNESS.small,
    iconSize: FONT_SIZE.small,
    labelSize: FONT_SIZE.xSmall,
    unitSize: FONT_SIZE.xSmall,
    width: BOX.small,
  },
  XS: {
    fontSize: FONT_SIZE.small,
    dialThickness: LINE_THICKNESS.xSmall,
    iconSize: FONT_SIZE.xSmall,
    labelSize: FONT_SIZE.xxSmall,
    unitSize: FONT_SIZE.xxSmall,
    width: BOX.xSmall,
  },
};

export type SizeStyle = 'XXL' | 'XL' | 'L' | 'M' | 'S' | 'XS';

export declare type DialStyleSettingsMap = {
  [refId: string]: BaseStyleSettings & {
    yMin?: number;
    yMax?: number;
  };
};
