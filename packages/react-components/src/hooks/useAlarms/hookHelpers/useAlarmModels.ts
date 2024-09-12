import { useMemo } from 'react';
import { IoTEventsClient } from '@aws-sdk/client-iot-events';
import { getAlarmModelNameFromAlarmSourceProperty } from '../utils/alarmModelUtils';
import { AlarmData, AlarmProperty } from '../types';
import { useDescribeAlarmModels } from '../../../queries';
import { getStatusForQuery } from '../utils/queryUtils';

export interface UseAlarmModelsOptions {
  iotEventsClient?: IoTEventsClient;
  alarmDataList?: AlarmData[];
}

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
  alarmDataList = [],
}: UseAlarmModelsOptions): AlarmData[] {
  // Filter AlarmData with a source property and data
  const alarmModelRequests = alarmDataList
    .filter(
      (alarmData) =>
        alarmData.source &&
        alarmData.source.data &&
        alarmData.source.data.length > 0
    )
    .map((alarmData) => ({
      alarmModelName: getAlarmModelNameFromAlarmSourceProperty(
        alarmData.source
      ),
    }));

  const alarmModelQueries = useDescribeAlarmModels({
    iotEventsClient,
    requests: alarmModelRequests,
  });

  return useMemo(() => {
    /**
     * Walk through the alarmDataList to inject the alarm models for a matching request.
     *
     * filteredIndex tracks progress through the filtered request list and associated query responses.
     *
     * Both lists have the same order, where the alarmDataList may have more elements than the filtered list.
     */
    let filteredIndex = 0;
    return (
      alarmDataList?.map((alarmData) => {
        // Try to access AlarmData alarm source property
        const sourceProperty: AlarmProperty | undefined = alarmData.source;
        if (
          sourceProperty &&
          sourceProperty.data &&
          filteredIndex < alarmModelRequests.length &&
          // Look up if AlarmData alarm source matches the alarm model request
          alarmModelRequests[filteredIndex].alarmModelName ===
            getAlarmModelNameFromAlarmSourceProperty(sourceProperty)
        ) {
          const alarmModel = alarmModelQueries[filteredIndex].data;
          const status = getStatusForQuery(
            alarmModelQueries[filteredIndex],
            alarmData.status
          );
          filteredIndex++;

          // Inject alarm asset property data into the AlarmData
          return {
            ...alarmData,
            // Right now only support the latest version of the alarm model
            models: alarmModel ? [alarmModel] : undefined,
            status,
          };
        } else {
          return alarmData;
        }
      }) ?? []
    );
  }, [alarmDataList, alarmModelRequests, alarmModelQueries]);
}
