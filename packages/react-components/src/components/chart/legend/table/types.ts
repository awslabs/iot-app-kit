import { DataStream, Primitive } from '@iot-app-kit/core';

export type TrendCursorValues = { [id in string]?: number };
export type DataStreamInformation = Pick<
  DataStream,
  'id' | 'name' | 'color'
> & {
  trendCursorValues: TrendCursorValues;
  latestValue: Primitive | undefined;
};

export type TrendCursor = { id: string; date: number; color?: string };
