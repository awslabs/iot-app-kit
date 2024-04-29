import { AnomalyData, AnomalyDescription } from '../../../data';
import { ThemeMode, TooltipSort } from '../types';

export type ConfigurationOptions = {
  title?: string;
  mode?: ThemeMode;
  description?: AnomalyDescription;
  loading?: boolean;
  decimalPlaces?: number;
  tooltipSort?: TooltipSort;
  showYAxis?: boolean;
  showTimestamp?: boolean;
};

export type DataSetOptions = { data: AnomalyData | undefined };
