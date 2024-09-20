import { TimeSeriesDataQuery } from '@iot-app-kit/core';
import { AlarmDataQuery } from '@iot-app-kit/source-iotsitewise';

export type AxisSettings = {
  showX?: boolean;
  showY?: boolean;
  yAxisLabel?: string;
};

export type ChartSize = {
  width: number;
  height: number;
};

export type ComponentQuery = AlarmDataQuery | TimeSeriesDataQuery;
