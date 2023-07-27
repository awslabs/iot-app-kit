import {
  DeleteAlarmModelCommand,
  type DeleteAlarmModelCommandInput,
  type DeleteAlarmModelCommandOutput,
  type IoTEventsServiceException,
} from '@aws-sdk/client-iot-events';
import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { iotEventsKeys } from '../cache';
import type { WithClient } from '../types';

export interface UseDeleteAlarmModelProps extends WithClient {
  options?: UseMutationOptions<DeleteAlarmModelCommandOutput, IoTEventsServiceException, DeleteAlarmModelCommandInput>;
}

export function useDeleteAlarmModel({ client, options }: UseDeleteAlarmModelProps) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (input: DeleteAlarmModelCommandInput) => client.send(new DeleteAlarmModelCommand(input)),
    onSuccess: (_output, input) => {
      // Invalidate all lists of alarm model summaries which the alarmModel could be in.
      queryClient.invalidateQueries(iotEventsKeys.alarmModelSummaryLists());
      // Invalidate the deleted alarm model.
      queryClient.invalidateQueries(iotEventsKeys.alarmModelDescription({ alarmModelName: input.alarmModelName }));
    },
  });
}
