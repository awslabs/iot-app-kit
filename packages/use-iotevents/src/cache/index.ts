import { type DescribeAlarmModelCommandInput, type ListAlarmModelsCommandInput } from '@aws-sdk/client-iot-events';

export const iotEventsKeys = {
  /** Reference to all IoT Events resources within the application cache. */
  all: [{ service: 'IoT Events' }] as const,

  /** Reference to all alarm model resources.  */
  alarmModels: () => [{ ...iotEventsKeys.all[0], scope: 'alarm models' }] as const,
  /** Reference to all alarm model descriptions. */
  alarmModelDescriptions: () => [{ ...iotEventsKeys.alarmModels()[0], resource: 'alarm model description' }] as const,
  /** Reference to a single alarm model description. */
  alarmModelDescription: (input: DescribeAlarmModelCommandInput) =>
    [{ ...iotEventsKeys.alarmModelDescriptions()[0], ...input }] as const,
  /** Reference to all alarm model summary lists. */
  alarmModelSummaryLists: () => [{ ...iotEventsKeys.alarmModels()[0], resource: 'alarm model summary' }] as const,
  /** Reference to a single alarm model summary list. */
  alarmModelSummaryList: (input: Omit<ListAlarmModelsCommandInput, 'nextToken'>) =>
    [{ ...iotEventsKeys.alarmModelSummaryLists()[0], ...input }] as const,
} as const;
