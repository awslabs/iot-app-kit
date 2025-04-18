import { type Viewport } from '@iot-app-kit/core';
import { type AnomalyDataQuery } from '@iot-app-kit/source-iotsitewise';
import type { FixedLengthArray } from 'type-fest';
import { type AssistantProperty } from '../../common/assistantProps';
import {
  type AnomalyArrowDataSource,
  type AnomalyObjectDataSource,
} from '../../data';

export type TooltipSort = 'value' | 'alphabetical';
export type ThemeMode = 'light' | 'dark';

export type AnomalyChartDataSources =
  | AnomalyObjectDataSource
  | AnomalyArrowDataSource;

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
  gestures?: boolean;
  mode?: ThemeMode;
  decimalPlaces?: number;
  viewport?: Viewport;
  tooltipSort?: TooltipSort;
  axis?: {
    showY?: boolean;
    showX?: boolean;
    xLabel?: string;
    yLabel?: string;
  };
  showTimestamp?: boolean;
  timeZone?: string;
  assistant?: AssistantProperty;
};
