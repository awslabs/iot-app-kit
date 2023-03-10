import { ComparisonOperator, Primitive } from '@iot-app-kit/core';
import { ALARM_STATUS } from './constants';

export type UpperCaseStateName = keyof typeof ALARM_STATUS;
export type PascalCaseStateName = typeof ALARM_STATUS[UpperCaseStateName];

export type AlarmModel = {
  inputPropertyId: string;
  comparisonOperator: ComparisonOperator;
  thresholdPropertyId: string;
  severity: number;
};

export type Alarm = AlarmModel & {
  assetId: string;
  alarmStatePropertyId: string;
  threshold: Primitive;
  rule: string;
  state: string;
};

type AlarmStreamId = string;

export type Alarms = Record<AlarmStreamId, Alarm>;

type AlarmModelName = string;

export type AlarmModels = Record<AlarmModelName, AlarmModel>;
