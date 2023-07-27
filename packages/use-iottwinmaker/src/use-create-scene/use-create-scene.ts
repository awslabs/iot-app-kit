import {
  CreateSceneCommand,
  type CreateSceneCommandInput,
  type CreateSceneCommandOutput,
  type IoTTwinMakerServiceException,
} from '@aws-sdk/client-iottwinmaker';
import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { iotTwinMakerKeys } from '../cache';
import type { WithClient } from '../types';

export interface UseCreateSceneProps extends WithClient {
  options?: UseMutationOptions<CreateSceneCommandOutput, IoTTwinMakerServiceException, CreateSceneCommandInput>;
}

/** Use to create IoT TwinMaker scene resources. */
export function useCreateScene({ client, options }: UseCreateSceneProps) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (input: CreateSceneCommandInput) => client.send(new CreateSceneCommand(input)),
    onSuccess: () => {
      // Invalidate all lists of scene summaries which the scene could appear in.
      queryClient.invalidateQueries(iotTwinMakerKeys.sceneSummaryLists());
    },
  });
}
