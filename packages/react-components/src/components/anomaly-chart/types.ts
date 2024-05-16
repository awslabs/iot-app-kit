import { Viewport } from '@iot-app-kit/core';
import type { FixedLengthArray } from 'type-fest';
import { AnomalyObjectDataSource } from '../../data/transformers/anomaly/object/datasource';
import { AnomalyDataQuery } from '@iot-app-kit/source-iotsitewise';

export type TooltipSort = 'value' | 'alphabetical';
export type ThemeMode = 'light' | 'dark';

export type AnomalyChartDataSources = AnomalyObjectDataSource;

export type AnomalyChartDataSourceOption = {
  /**
   * Data is a fixed length array of 1.
   * The widget can only display 1 anomaly for now.
   */
  data: FixedLengthArray<AnomalyChartDataSources, 1>;
};
export type AnomalyChartQueryOption = {
  query: AnomalyDataQuery;
};

// Atleast one datasource type is required, can be either or.
export type AnomalyChartWithData = Partial<AnomalyChartDataSourceOption> &
  Partial<AnomalyChartQueryOption> &
  (AnomalyChartDataSourceOption | AnomalyChartQueryOption);

export type AnomalyChartOptions = AnomalyChartWithData & {
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
