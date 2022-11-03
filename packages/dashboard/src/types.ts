import { TimeQuery, TimeSeriesData, TimeSeriesDataRequest } from '@iot-app-kit/core';
import { Annotations, ChartConfig, MinimalViewPortConfig } from '@synchro-charts/core';

export type Widget = {
  id: string;
  componentTag: string;
  title?: string;
  x: number;
  y: number;
  z: number;
  height: number;
  width: number;
  queries: TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>[];
  properties?: ChartConfig;
  annotations?: Annotations;
};

export type DashboardConfiguration = {
  widgets: Widget[];
  viewport: MinimalViewPortConfig;
};

export type Position = { x: number; y: number };
export type Rect = { x: number; y: number; width: number; height: number };
