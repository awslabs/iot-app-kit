import { AnomalyData, AnomalyDescription } from '../../../data';
import { ThemeMode, TooltipSort } from '../types';

export type ConfigurationOptions = {
  mode?: ThemeMode;
  description?: AnomalyDescription;
  loading?: boolean;
  decimalPlaces?: number;
  tooltipSort?: TooltipSort;
  axis?: {
    showY?: boolean;
    showX?: boolean;
  };
  showTimestamp?: boolean;
};

export type DataSetOptions = { data: AnomalyData | undefined };
