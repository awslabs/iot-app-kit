import {
  UpdateAlarmModelCommand,
  type UpdateAlarmModelCommandInput,
  type UpdateAlarmModelCommandOutput,
  type IoTEventsServiceException,
} from '@aws-sdk/client-iot-events';
import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { iotEventsKeys } from '../cache';
import type { WithClient } from '../types';

export interface UseUpdateAlarmModelProps extends WithClient {
  options?: UseMutationOptions<UpdateAlarmModelCommandOutput, IoTEventsServiceException, UpdateAlarmModelCommandInput>;
}

/** Use to create IoT Events alarm model resources. */
export function useUpdateAlarmModel({ client, options }: UseUpdateAlarmModelProps) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (input: UpdateAlarmModelCommandInput) => client.send(new UpdateAlarmModelCommand(input)),
    onSuccess: (_output, input) => {
      // Invalidate all lists of asset summaries which the asset could be in.
      queryClient.invalidateQueries(iotEventsKeys.alarmModelSummaryLists());
      // Invalidate the updated asset.
      queryClient.invalidateQueries(iotEventsKeys.alarmModelDescription({ alarmModelName: input.alarmModelName }));
    },
  });
}
