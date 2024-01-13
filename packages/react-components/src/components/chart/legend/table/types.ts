import { DataStream } from '@iot-app-kit/core';

export type TrendCursorValues = { [id in string]?: number };
export type DataStreamInformation = Pick<
  DataStream,
  'id' | 'name' | 'color'
> & { trendCursorValues: TrendCursorValues };

export type TrendCursor = { id: string; date: number; color?: string };
