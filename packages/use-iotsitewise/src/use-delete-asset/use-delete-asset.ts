import {
  DeleteAssetCommand,
  type DeleteAssetCommandInput,
  type DeleteAssetCommandOutput,
  type IoTSiteWiseServiceException,
} from '@aws-sdk/client-iotsitewise';
import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { iotSiteWiseKeys } from '../cache';
import type { WithClient } from '../types';

export interface UseDeleteAssetProps extends WithClient {
  options?: UseMutationOptions<DeleteAssetCommandOutput, IoTSiteWiseServiceException, DeleteAssetCommandInput>;
}

export function useDeleteAsset({ client, options }: UseDeleteAssetProps) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (input: DeleteAssetCommandInput) => client.send(new DeleteAssetCommand(input)),
    onSuccess: (_output, input) => {
      // Invalidate all lists of asset summaries which the asset could be in.
      queryClient.invalidateQueries(iotSiteWiseKeys.assetSummaryLists());
      // Invalidate the deleted asset.
      queryClient.invalidateQueries(iotSiteWiseKeys.assetDescription({ assetId: input.assetId }));
    },
  });
}
