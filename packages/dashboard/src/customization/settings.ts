export type SimpleFontSettings = {
  fontSize?: number;
  fontColor?: string;
};

export type ComplexFontSettings = {
  fontSize?: number;
  fontColor?: string;
  fontFamily?: string;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderlined?: boolean;
};

export type ThresholdSettings = {
  thresholds: {
    id: string;
    comparisonOperator: string;
    comparisonValue: string | boolean | number;
    label?: string;
    color?: string;
  }[];
  colorAcrossThresholds: boolean;
};

export type AxisSettings = {
  showX?: boolean;
  showY?: boolean;
  yAxisLabel?: string;
};

export type LegendSettings = {
  show?: boolean;
  position?: string;
};
