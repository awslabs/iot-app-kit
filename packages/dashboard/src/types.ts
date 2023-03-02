import {
  AlarmsConfig,
  Annotations,
  Axis,
  ChartConfig,
  LabelsConfig,
  LayoutConfig,
  LegendConfig,
  MessageOverrides,
  MinimalSizeConfig,
  MinimalViewPortConfig,
  MovementConfig,
  ScaleConfig,
  Trend,
} from '@synchro-charts/core';

import { TextWidgetMessages, InputWidgetMessages } from './messages';
import { AssetQuery, StyleSettingsMap } from '@iot-app-kit/core';

export const AppKitComponentTags = [
  'iot-bar-chart',
  'iot-kpi',
  'iot-line-chart',
  'iot-scatter-chart',
  'iot-status-grid',
  'iot-status-timeline',
  'iot-table',
] as const;
export type AppKitComponentTag = typeof AppKitComponentTags[number];

export const PrimitiveComponentTags = <const>['text', 'input'];
export type PrimitiveComponentTag = typeof PrimitiveComponentTags[number];

export type ComponentTag = AppKitComponentTag | PrimitiveComponentTag;

export type Widget = {
  id: string;
  componentTag: ComponentTag;
  x: number;
  y: number;
  z: number;
  height: number;
  width: number;
  assets?: AssetQuery[];
};

export type AppKitWidget = Widget & {
  componentTag: AppKitComponentTag;
  widgetId: string;
  assets?: AssetQuery[];
  movement?: MovementConfig;
  scale?: ScaleConfig;
  layout?: LayoutConfig;
  legend?: LegendConfig;
  annotations?: Annotations;
  axis?: Axis.Options;
  messageOverrides?: MessageOverrides;
  size?: MinimalSizeConfig;
  trends?: Trend[];
  alarms?: AlarmsConfig;
  gestures?: boolean;
  labelsConfig?: LabelsConfig;
  readOnly?: boolean;
  isEditing?: boolean;
  properties?: ChartConfig;
  styleSettings?: StyleSettingsMap;
};

export type TextWidget = Widget & {
  componentTag: 'text';
  text: string;
  font?: string;
  fontSize?: number;
  color?: string;
  italic?: boolean;
  bold?: boolean;
  underline?: boolean;
  messageOverrides?: TextWidgetMessages;
  isLink?: boolean;
  link?: string;
};

export type InputWidgetOption = {
  label: string;
};

export type InputWidget = Widget & {
  componentTag: 'input';
  options: InputWidgetOption[];
  messageOverrides?: InputWidgetMessages;
};

export type PrimitiveWidget = TextWidget;

export type DashboardConfiguration = {
  widgets: Widget[];
  viewport: MinimalViewPortConfig;
};

export type Position = { x: number; y: number };
export type Rect = { x: number; y: number; width: number; height: number };
export type Selection = {
  start: Position;
  end: Position;
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

export type PickRequiredOptional<T, TRequired extends keyof T, TOptional extends keyof T> = Pick<T, TRequired> &
  RecursivePartial<Pick<T, TOptional>>;
