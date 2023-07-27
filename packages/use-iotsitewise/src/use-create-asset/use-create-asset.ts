import {
  CreateAssetCommand,
  type CreateAssetCommandInput,
  type CreateAssetCommandOutput,
  type IoTSiteWiseServiceException,
} from '@aws-sdk/client-iotsitewise';
import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { iotSiteWiseKeys } from '../cache';
import type { WithClient } from '../types';

export interface UseCreateAssetProps extends WithClient {
  options?: UseMutationOptions<CreateAssetCommandOutput, IoTSiteWiseServiceException, CreateAssetCommandInput>;
}

/** Use to create IoT SiteWise asset resources. */
export function useCreateAsset({ client, options }: UseCreateAssetProps) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (input: CreateAssetCommandInput) => client.send(new CreateAssetCommand(input)),
    onSuccess: () => {
      // Invalidate all lists of asset summaries which the asset could appear in.
      queryClient.invalidateQueries(iotSiteWiseKeys.assetSummaryLists());
    },
  });
}
