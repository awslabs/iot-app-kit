import {
  UpdateAssetCommand,
  type UpdateAssetCommandInput,
  type UpdateAssetCommandOutput,
  type IoTSiteWiseServiceException,
} from '@aws-sdk/client-iotsitewise';
import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { iotSiteWiseKeys } from '../cache';
import type { WithClient } from '../types';

export interface UseUpdateAssetProps extends WithClient {
  options?: UseMutationOptions<UpdateAssetCommandOutput, IoTSiteWiseServiceException, UpdateAssetCommandInput>;
}

/** Use to update an IoT SiteWise asset. */
export function useUpdateAsset({ client, options }: UseUpdateAssetProps) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (input: UpdateAssetCommandInput) => client.send(new UpdateAssetCommand(input)),
    onSuccess: (_output, input) => {
      // Invalidate all lists of asset summaries which the asset could be in.
      queryClient.invalidateQueries(iotSiteWiseKeys.assetSummaryLists());
      // Invalidate the updated asset.
      queryClient.invalidateQueries(iotSiteWiseKeys.assetDescription({ assetId: input.assetId }));
    },
  });
}
