import type { Primitive } from '@iot-app-kit/helpers';
import { type DataStream } from '@iot-app-kit/core';
import type { AlarmAssistantContext } from '../../../../common/assistantProps';

export type TrendCursorValues = { [id in string]?: number };
export type DataStreamInformation = Pick<
  DataStream,
  'id' | 'name' | 'color' | 'assetName' | 'refId'
> & {
  trendCursorValues: TrendCursorValues;
  latestValue: Primitive | undefined;
  latestAlarmStateValue?: string;
} & DataStreamMinMax &
  AlarmAssistantContext;

export type TrendCursor = {
  id: string;
  date: number;
  color?: string;
};
export type DataStreamMinMax = {
  maxValue: number | string | undefined;
  minValue: number | string | undefined;
};
