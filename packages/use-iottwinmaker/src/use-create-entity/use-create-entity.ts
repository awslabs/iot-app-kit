import {
  CreateEntityCommand,
  type CreateEntityCommandInput,
  type CreateEntityCommandOutput,
  type IoTTwinMakerServiceException,
} from '@aws-sdk/client-iottwinmaker';
import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { iotTwinMakerKeys } from '../cache';
import type { WithClient } from '../types';

export interface UseCreateEntityProps extends WithClient {
  options?: UseMutationOptions<CreateEntityCommandOutput, IoTTwinMakerServiceException, CreateEntityCommandInput>;
}

/** Use to create IoT TwinMaker entity resources. */
export function useCreateEntity({ client, options }: UseCreateEntityProps) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (input: CreateEntityCommandInput) => client.send(new CreateEntityCommand(input)),
    onSuccess: () => {
      // Invalidate all lists of entity summaries which the entity could appear in.
      queryClient.invalidateQueries(iotTwinMakerKeys.entitySummaryLists());
    },
  });
}
