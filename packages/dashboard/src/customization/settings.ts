import type { Threshold } from '@iot-app-kit/core';

export type SimpleFontSettings = {
  fontSize?: number;
  fontColor?: string;
};

export type ComplexFontSettings = {
  fontSize?: number;
  fontColor?: string;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderlined?: boolean;
};
export type ThresholdWithId = Threshold & { id: string };

export type AxisSettings = {
  showX?: boolean;
  showY?: boolean;
  yAxisLabel?: string;
};
