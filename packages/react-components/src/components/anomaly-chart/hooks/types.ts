import {
  type AnomalyData,
  type AnomalyDescription,
} from '@iot-app-kit/component-core';
import { type ThemeMode, type TooltipSort } from '../types';

export type ConfigurationOptions = {
  gestures?: boolean;
  mode?: ThemeMode;
  description?: AnomalyDescription;
  loading?: boolean;
  significantDigits?: number;
  tooltipSort?: TooltipSort;
  axis?: {
    showY?: boolean;
    showX?: boolean;
    xLabel?: string;
    yLabel?: string;
  };
  showTimestamp?: boolean;
  timeZone?: string;
};

export type DataSetOptions = { data: AnomalyData | undefined };
