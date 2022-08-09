import { TimeQuery, TimeSeriesData, TimeSeriesDataRequest } from '@iot-app-kit/core';
import { Annotations, ChartConfig, MinimalViewPortConfig } from '@synchro-charts/core';
import { Store } from 'redux';
import { DashboardAction } from './dashboard-actions/actions';

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

export type Anchor = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'left' | 'right' | 'top' | 'bottom';

export type DashboardConfiguration = {
  widgets: Widget[];
  viewport: MinimalViewPortConfig;
};

export type DashboardStore = Store<DashboardState, DashboardAction>;

export type Position = { x: number; y: number };
export type Rect = { x: number; y: number; width: number; height: number };

// Anchor specifies which portion of the selection box is initiating the resize.
// Current position is the position the cursor is, relative to the dashboard grid in pixels.
export type OnResize = ({ anchor, currentPosition }: { anchor: Anchor; currentPosition: Position }) => void;

export type UndoQueue = DashboardAction[];

export type DashboardState = {
  dashboardConfiguration: DashboardConfiguration;
  intermediateDashboardConfiguration: undefined | DashboardConfiguration;
  selectedWidgetIds: string[];
  numTimesCopyGroupHasBeenPasted: number;
  copyGroup: Widget[];
  stretchToFit: boolean;
  width: number;
  cellSize: number;
  undoQueue: UndoQueue;
  redoQueue: UndoQueue;
  previousPosition: Position | undefined;
};

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
