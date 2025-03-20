import { type PascalCaseStateName } from '@iot-app-kit/component-core';

export interface AlarmContent {
  alarmName?: string;
  alarmExpression?: string;
  assetId?: string;
  alarmState?: PascalCaseStateName;
  severity?: number;
}
