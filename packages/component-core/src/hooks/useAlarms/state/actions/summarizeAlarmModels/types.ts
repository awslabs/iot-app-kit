import { type DescribeAlarmModelResponse } from '@aws-sdk/client-iot-events';
import { type AlarmDataStatus } from '../../../types';

export interface AlarmModelSummary {
  request: {
    alarmModelName?: string;
  };
  status: AlarmDataStatus;
  data: DescribeAlarmModelResponse | undefined;
}

export interface SummarizeAlarmModelsActionPayload {
  alarmModelSummaries?: AlarmModelSummary[];
}

export interface SummarizeAlarmModelsAction
  extends SummarizeAlarmModelsActionPayload {
  type: 'SUMMARIZE_ALARM_MODELS';
}
