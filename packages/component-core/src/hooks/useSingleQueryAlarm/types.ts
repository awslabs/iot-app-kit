import { type PascalCaseStateName } from '../useAlarms/transformers';

export type AlarmContent = {
  alarmName?: string;
  alarmExpression?: string;
  assetId?: string;
  alarmState?: PascalCaseStateName;
  severity?: number;
};
