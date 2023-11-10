import type { Threshold } from '@iot-app-kit/core';
// FIXME: Export ThresholdStyleType from @iot-app-kit/react-components
// eslint-disable-next-line no-restricted-imports
import { ThresholdStyleType } from '@iot-app-kit/react-components/src/components/chart/types';

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
export type StyledThreshold = Threshold & ThresholdStyleType;

export type AxisSettings = {
  showX?: boolean;
  showY?: boolean;
  yAxisLabel?: string;
};
