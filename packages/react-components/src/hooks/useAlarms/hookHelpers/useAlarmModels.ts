import { IoTEventsClient } from '@aws-sdk/client-iot-events';
import { getAlarmModelNameFromAlarmSourceProperty } from '../utils/parseAlarmModels';
import type { AlarmData } from '../types';
import { useDescribeAlarmModels } from '../../../queries';
import { getStatusForQuery } from '../utils/queryStatus';
import type { QueryOptionsGlobal } from '../../../queries/common/types';
import { OnSummarizeAlarmModelsAction, useRequestSelector } from '../state';
import { useReactQueryEffect } from './useReactQueryEffect';

export type UseAlarmModelsOptions = {
  iotEventsClient?: IoTEventsClient;
  requests?: Pick<AlarmData, 'source'>[];
  onSummarizeAlarmModels: OnSummarizeAlarmModelsAction;
} & QueryOptionsGlobal;

/**
 * useAlarmModels is a hook used to describe the IoT Events alarm model
 * of a SiteWise alarm
 *
 * @param iotEventsClient is an AWS SDK IoT SiteWise client
 * @param alarmDataList is a list of AlarmData
 * @returns a list of AlarmData with the associated IoT Events alarm models
 */
export function useAlarmModels({
  iotEventsClient,
  requests = [],
  retry,
  onSummarizeAlarmModels,
}: UseAlarmModelsOptions) {
  const alarmModelRequests = useRequestSelector(
    requests,
    (alarmSourceRequests) =>
      alarmSourceRequests.map((request) => ({
        alarmModelName: getAlarmModelNameFromAlarmSourceProperty(
          request.source
        ),
      }))
  );

  const alarmModelQueries = useDescribeAlarmModels({
    iotEventsClient,
    requests: alarmModelRequests,
    retry,
  });

  useReactQueryEffect(() => {
    onSummarizeAlarmModels({
      alarmModelSummaries: alarmModelQueries.map((query, index) => ({
        request: alarmModelRequests[index],
        status: getStatusForQuery(query),
        data: query.data,
      })),
    });
  }, [alarmModelQueries]);
}
