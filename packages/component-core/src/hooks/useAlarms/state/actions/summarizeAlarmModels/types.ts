import { type DescribeAlarmModelResponse } from '@aws-sdk/client-iot-events';
import { type AlarmDataStatus } from '../../../types';

export type AlarmModelSummary = {
  request: {
    alarmModelName?: string;
  };
  status: AlarmDataStatus;
  data: DescribeAlarmModelResponse | undefined;
};

export type SummarizeAlarmModelsActionPayload = {
  alarmModelSummaries?: AlarmModelSummary[];
};

export type SummarizeAlarmModelsAction = SummarizeAlarmModelsActionPayload & {
  type: 'SUMMARIZE_ALARM_MODELS';
};
