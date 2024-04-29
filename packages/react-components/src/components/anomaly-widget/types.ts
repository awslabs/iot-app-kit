import { Viewport } from '@iot-app-kit/core';
import type { FixedLengthArray } from 'type-fest';
import { AnomalyObjectDataSource } from '../../data/transformers/anomaly/object/datasource';

export type TooltipSort = 'value' | 'alphabetical';
export type ThemeMode = 'light' | 'dark';

type AnomalyWidgetDataSources = AnomalyObjectDataSource;
export type AnomalyWidgetOptions = {
  title?: string;
  mode?: ThemeMode;
  decimalPlaces?: number;
  datasources: FixedLengthArray<AnomalyWidgetDataSources, 1>;
  viewport?: Viewport;
  tooltipSort?: TooltipSort;
  showYAxis?: boolean;
  showTimestamp?: boolean;
};
