import { type AnomalyData, type AnomalyDescription } from '../../../data';
import { type ThemeMode, type TooltipSort } from '../types';

export type ConfigurationOptions = {
  gestures?: boolean;
  mode?: ThemeMode;
  description?: AnomalyDescription;
  loading?: boolean;
  decimalPlaces?: number;
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
