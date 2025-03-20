import { type StatusIconType } from './constants';
import type { DataPoint } from '@iot-app-kit/core';

// Generic properties for single value display visualizations
export interface WidgetSettings {
  color?: string; // hex color string
  propertyPoint?: DataPoint;
  alarmPoint?: DataPoint;
  icon?: StatusIconType;
  unit?: string;
  error?: string;
  name?: string;
  detailedName?: string;
  aggregationType?: string;
  resolution?: number;
  isLoading?: boolean;
  significantDigits?: number;
  assetName?: string;
  propertyName?: string;
  titleText?: string;
}
