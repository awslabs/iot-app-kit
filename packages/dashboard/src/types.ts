import { AssetQuery } from '@iot-app-kit/core';
import { Annotations, ChartConfig, MinimalViewPortConfig } from '@synchro-charts/core';

export type ComponentTag =
  | 'iot-bar-chart'
  | 'iot-kpi'
  | 'iot-line-chart'
  | 'iot-scatter-chart'
  | 'iot-status-grid'
  | 'iot-status-timeline'
  | 'iot-table';

export type Widget = {
  id: string;
  componentTag: ComponentTag;
  title?: string;
  x: number;
  y: number;
  z: number;
  height: number;
  width: number;
  assets: AssetQuery[];
  properties?: ChartConfig;
  annotations?: Annotations;
};

export type DashboardConfiguration = {
  widgets: Widget[];
  viewport: MinimalViewPortConfig;
};

export type Position = { x: number; y: number };
export type Rect = { x: number; y: number; width: number; height: number };

export enum MouseClick {
  Left = 0,
  Right = 2,
}

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
    ? RecursivePartial<T[P]>
    : T[P];
};
