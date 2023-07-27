import {
  UpdateWorkspaceCommand,
  type UpdateWorkspaceCommandInput,
  type UpdateWorkspaceCommandOutput,
  type IoTTwinMakerServiceException,
} from '@aws-sdk/client-iottwinmaker';
import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { iotTwinMakerKeys } from '../cache';
import type { WithClient } from '../types';

export interface UseUpdateWorkspaceProps extends WithClient {
  options: UseMutationOptions<UpdateWorkspaceCommandOutput, IoTSiteWiseServiceException, UpdateWorkspaceCommandInput>;
}

/** Use to update an IoT TwinMaker workspace. */
export function useUpdateWorkspace({ client, options }: UseUpdateWorkspaceProps) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (input: UpdateWorkspaceCommandInput) => client.send(new UpdateWorkspaceCommand(input)),
    onSuccess: (_output, input) => {
      // Invalidate all lists of workspace summaries which the workspace could be in.
      queryClient.invalidateQueries(cacheKeys.workspaceSummaryLists());
    },
  });
}
