import { BaseStyleSettings } from '@iot-app-kit/core';
import { FONT_SIZE, LINE_THICKNESS } from '../../styleGuide';

export const DIAL_SIZE_CONFIG = {
  XXL: {
    fontSize: FONT_SIZE.XXL,
    dialThickness: LINE_THICKNESS.XXL,
    iconSize: FONT_SIZE.XXL,
    labelSize: FONT_SIZE.L,
    unitSize: FONT_SIZE.L,
  },
  XL: {
    fontSize: FONT_SIZE.XL,
    dialThickness: LINE_THICKNESS.XL,
    iconSize: FONT_SIZE.L,
    labelSize: FONT_SIZE.M,
    unitSize: FONT_SIZE.M,
  },
  L: {
    fontSize: FONT_SIZE.L,
    dialThickness: LINE_THICKNESS.L,
    iconSize: FONT_SIZE.L,
    labelSize: FONT_SIZE.S,
    unitSize: FONT_SIZE.S,
  },
  M: {
    fontSize: FONT_SIZE.M,
    dialThickness: LINE_THICKNESS.M,
    iconSize: FONT_SIZE.M,
    labelSize: FONT_SIZE.M,
    unitSize: FONT_SIZE.M,
  },
  S: {
    fontSize: FONT_SIZE.S,
    dialThickness: LINE_THICKNESS.S,
    iconSize: FONT_SIZE.XS,
    labelSize: FONT_SIZE.XXS,
    unitSize: FONT_SIZE.XXS,
  },
  XS: {
    fontSize: FONT_SIZE.XS,
    dialThickness: LINE_THICKNESS.XS,
    iconSize: FONT_SIZE.XXS,
    labelSize: FONT_SIZE.XXXS,
    unitSize: FONT_SIZE.XXXS,
  },
};

export type SizeStyle = 'XXL' | 'XL' | 'L' | 'M' | 'S' | 'XS';

export declare type DialStyleSettingsMap = {
  [refId: string]: BaseStyleSettings & {
    yMin?: number;
    yMax?: number;
  };
};
