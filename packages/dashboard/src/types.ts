import { Viewport } from '@iot-app-kit/core';

//eslint-disable-next-line
export type Widget<T extends Record<any, any>> = {
  type: string;
  id: string;
  x: number;
  y: number;
  z: number;
  height: number;
  width: number;
  properties: T;
};

//eslint-disable-next-line
export type AnyWidget = Widget<Record<any, any>>;

export type DashboardConfiguration = {
  widgets: AnyWidget[];
  viewport: Viewport;
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
