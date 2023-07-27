import {
  CreateComponentTypeCommand,
  type CreateComponentTypeCommandInput,
  type CreateComponentTypeCommandOutput,
  type IoTTwinMakerServiceException,
} from '@aws-sdk/client-iottwinmaker';
import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { iotTwinMakerKeys } from '../cache';
import type { WithClient } from '../types';

export interface UseCreateComponentTypeProps extends WithClient {
  options?: UseMutationOptions<
    CreateComponentTypeCommandOutput,
    IoTTwinMakerServiceException,
    CreateComponentTypeCommandInput
  >;
}

/** Use to create IoT TwinMaker componentType resources. */
export function useCreateComponentType({ client, options }: UseCreateComponentTypeProps) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (input: CreateComponentTypeCommandInput) => client.send(new CreateComponentTypeCommand(input)),
    onSuccess: () => {
      // Invalidate all lists of componentType summaries which the componentType could appear in.
      queryClient.invalidateQueries(iotTwinMakerKeys.componentTypeSummaryLists());
    },
  });
}
