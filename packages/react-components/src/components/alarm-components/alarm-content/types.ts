import { type PascalCaseStateName } from '../../../hooks/useAlarms/transformers';

export type AlarmContent = {
  alarmName?: string;
  alarmExpression?: string;
  assetId?: string;
  alarmState?: PascalCaseStateName;
  severity?: number;
};
