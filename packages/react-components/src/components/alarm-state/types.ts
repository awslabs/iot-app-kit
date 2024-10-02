import { PascalCaseStateName } from '../../hooks/useAlarms/transformers';

export type AlarmContent = {
  alarmName?: string;
  alarmExpression?: string;
  assetId?: string;
  state?: PascalCaseStateName;
  severity?: number;
};
