import type { PascalCaseStateName } from '../useAlarms/transformers';

export interface AlarmContent {
  alarmName?: string;
  alarmExpression?: string;
  assetId?: string;
  alarmState?: PascalCaseStateName;
  severity?: number;
}
