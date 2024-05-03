import { Viewport } from '@iot-app-kit/core';
import type { FixedLengthArray } from 'type-fest';
import { AnomalyObjectDataSource } from '../../data/transformers/anomaly/object/datasource';

export type TooltipSort = 'value' | 'alphabetical';
export type ThemeMode = 'light' | 'dark';

type AnomalyWidgetDataSources = AnomalyObjectDataSource;
export type AnomalyWidgetOptions = {
  datasources: FixedLengthArray<AnomalyWidgetDataSources, 1>;
  title?: string;
  mode?: ThemeMode;
  decimalPlaces?: number;
  viewport?: Viewport;
  tooltipSort?: TooltipSort;
  axis?: {
    showY?: boolean;
    showX?: boolean;
  };
  showTimestamp?: boolean;
};
