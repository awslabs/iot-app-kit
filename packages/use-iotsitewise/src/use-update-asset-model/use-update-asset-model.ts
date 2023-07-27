import {
  UpdateAssetModelCommand,
  type UpdateAssetModelCommandInput,
  type UpdateAssetModelCommandOutput,
  type IoTSiteWiseServiceException,
} from '@aws-sdk/client-iotsitewise';
import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { iotSiteWiseKeys } from '../cache';
import type { WithClient } from '../types';

export interface UseUpdateAssetModelProps extends WithClient {
  options?: UseMutationOptions<
    UpdateAssetModelCommandOutput,
    IoTSiteWiseServiceException,
    UpdateAssetModelCommandInput
  >;
}

/** Use to update an IoT SiteWise asset model resource. */
export function useUpdateAssetModel({ client, options }: UseUpdateAssetModelProps) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (input: UpdateAssetModelCommandInput) => client.send(new UpdateAssetModelCommand(input)),
    onSuccess: (_output, input) => {
      // Invalidate all lists of asset model summaries which the asset model could be in.
      queryClient.invalidateQueries(iotSiteWiseKeys.assetModelSummaryLists());
      // Invalidate the updated asset model.
      queryClient.invalidateQueries(iotSiteWiseKeys.assetModelDescription({ assetModelId: input.assetModelId }));
    },
  });
}
