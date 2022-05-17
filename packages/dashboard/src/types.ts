export type Widget = {
  id: string;
  widget: string;
  x: number;
  y: number;
  height: number;
  width: number;
};

export type WidgetSide = 'top' | 'bottom' | 'left' | 'right';
export type DashboardConfiguration = Widget[];

export type Position = { x: number; y: number };
export type Rect = { x: number; y: number; width: number; height: number };

export type ResizingInfo = { side: WidgetSide; widgetId: string };
