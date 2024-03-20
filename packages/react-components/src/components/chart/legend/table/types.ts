import { DataStream, Primitive } from '@iot-app-kit/core';

export type TrendCursorValues = { [id in string]?: number };
export type DataStreamInformation = Pick<
  DataStream,
  'id' | 'name' | 'color' | 'assetName'
> & {
  trendCursorValues: TrendCursorValues;
  latestValue: Primitive | undefined;
} & DataStreamMinMax;

export type TrendCursor = { id: string; date: number; color?: string };
export type DataStreamMinMax = {
  maxValue: number | string | undefined;
  minValue: number | string | undefined;
};
