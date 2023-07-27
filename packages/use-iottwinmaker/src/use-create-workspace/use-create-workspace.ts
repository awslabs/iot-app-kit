import {
  CreateWorkspaceCommand,
  type CreateWorkspaceCommandInput,
  type CreateWorkspaceCommandOutput,
  type IoTTwinMakerServiceException,
} from '@aws-sdk/client-iottwinmaker';
import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { iotTwinMakerKeys } from '../cache';
import type { WithClient } from '../types';

export interface UseCreateWorkspaceProps extends WithClient {
  options?: UseMutationOptions<CreateWorkspaceCommandOutput, IoTTwinMakerServiceException, CreateWorkspaceCommandInput>;
}

/** Use to create IoT TwinMaker workspace resources. */
export function useCreateWorkspace({ client, options }: UseCreateWorkspaceProps) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (input: CreateWorkspaceCommandInput) => client.send(new CreateWorkspaceCommand(input)),
    onSuccess: () => {
      // Invalidate all lists of workspace summaries which the workspace could appear in.
      queryClient.invalidateQueries(iotTwinMakerKeys.workspaceSummaryLists());
    },
  });
}
