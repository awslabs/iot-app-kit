import type { DashboardWidgetMap } from './types';

export interface WidgetInstance<
  WidgetType extends string = string,
  Properties = unknown
> {
  type: WidgetType;
  properties: Properties;
  id: string;
  width: number;
  height: number;
  x: number;
  y: number;
  z: number;
}

export type DashboardWidgetInstance = {
  [K in keyof DashboardWidgetMap]: WidgetInstance<K, DashboardWidgetMap[K]>;
}[keyof DashboardWidgetMap];

export interface DashboardConfiguration {
  widgets: DashboardWidgetInstance[];
}
