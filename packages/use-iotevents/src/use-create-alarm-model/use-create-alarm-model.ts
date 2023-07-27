import {
  CreateAlarmModelCommand,
  type CreateAlarmModelCommandInput,
  type CreateAlarmModelCommandOutput,
  type IoTEventsServiceException,
} from '@aws-sdk/client-iot-events';
import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { iotEventsKeys } from '../cache';
import type { WithClient } from '../types';

export interface UseCreateAlarmModelProps extends WithClient {
  options?: UseMutationOptions<CreateAlarmModelCommandOutput, IoTEventsServiceException, CreateAlarmModelCommandInput>;
}

/** Use to create IoT Events alarm model resources. */
export function useCreateAlarmModel({ client, options }: UseCreateAlarmModelProps) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (input: CreateAlarmModelCommandInput) => client.send(new CreateAlarmModelCommand(input)),
    onSuccess: () => {
      // Invalidate all lists of alarmModel summaries which the alarmModel could appear in.
      queryClient.invalidateQueries(iotEventsKeys.alarmModelSummaryLists());
    },
  });
}
