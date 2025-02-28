import { type PascalCaseStateName } from '@iot-app-kit/component-core';

export type AlarmContent = {
  alarmName?: string;
  alarmExpression?: string;
  assetId?: string;
  alarmState?: PascalCaseStateName;
  severity?: number;
};
