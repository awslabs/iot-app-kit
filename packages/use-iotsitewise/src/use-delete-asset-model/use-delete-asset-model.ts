import {
  DeleteAssetModelCommand,
  type DeleteAssetModelCommandInput,
  type DeleteAssetModelCommandOutput,
  type IoTSiteWiseServiceException,
} from '@aws-sdk/client-iotsitewise';
import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { iotSiteWiseKeys } from '../cache';
import type { WithClient } from '../types';

export interface UseDeleteAssetModelProps extends WithClient {
  options?: UseMutationOptions<
    DeleteAssetModelCommandOutput,
    IoTSiteWiseServiceException,
    DeleteAssetModelCommandInput
  >;
}

export function useDeleteAssetModel({ client, options }: UseDeleteAssetModelProps) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (input: DeleteAssetModelCommandInput) => client.send(new DeleteAssetModelCommand(input)),
    onSuccess: (_output, input) => {
      // Invalidate all lists of asset model summaries which the asset model could be in.
      queryClient.invalidateQueries(iotSiteWiseKeys.assetModelSummaryLists());
      // Invalidate the deleted asset model.
      queryClient.invalidateQueries(iotSiteWiseKeys.assetModelDescription({ assetModelId: input.assetModelId }));
    },
  });
}
