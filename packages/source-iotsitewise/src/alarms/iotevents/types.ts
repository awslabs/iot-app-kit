import { type ALARM_STATUS } from './constants';
import { type COMPARISON_OPERATOR, type Primitive } from '@synchro-charts/core';

export type UpperCaseStateName = keyof typeof ALARM_STATUS;
export type PascalCaseStateName = (typeof ALARM_STATUS)[UpperCaseStateName];

export interface AlarmModel {
  inputPropertyId: string;
  comparisonOperator: COMPARISON_OPERATOR;
  thresholdPropertyId: string;
  severity: number;
}

export interface Alarm extends AlarmModel {
  assetId: string;
  alarmStatePropertyId: string;
  threshold: Primitive;
  rule: string;
  state: string;
}

type AlarmStreamId = string;

export type Alarms = Record<AlarmStreamId, Alarm>;

type AlarmModelName = string;

export type AlarmModels = Record<AlarmModelName, AlarmModel>;
