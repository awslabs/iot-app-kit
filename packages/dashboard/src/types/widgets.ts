export type WidgetType = string;

export interface Widget<
  T extends WidgetType = WidgetType,
  P = Record<string, unknown>
> {
  id: string;
  x: number;
  y: number;
  z: number;
  height: number;
  width: number;
  type: T;
  properties: P;
}

export interface RegisterWidget<T extends string, P> {
  (type: T, properties: P): void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DashboardWidgetRegistry {}

export type RegisteredWidgetType = keyof DashboardWidgetRegistry;

export type RegisteredWidget = {
  [K in RegisteredWidgetType]: Widget<K, DashboardWidgetRegistry[K]>;
}[RegisteredWidgetType];
