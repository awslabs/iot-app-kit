import {
  CreateAssetModelCommand,
  type CreateAssetModelCommandInput,
  type CreateAssetModelCommandOutput,
  type IoTSiteWiseServiceException,
} from '@aws-sdk/client-iotsitewise';
import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { iotSiteWiseKeys } from '../cache';
import type { WithClient } from '../types';

export interface UseCreateAssetModelProps extends WithClient {
  options?: UseMutationOptions<
    CreateAssetModelCommandOutput,
    IoTSiteWiseServiceException,
    CreateAssetModelCommandInput
  >;
}

/** Use to create IoT SiteWise asset model resources. */
export function useCreateAssetModel({ client, options }: UseCreateAssetModelProps) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (input: CreateAssetModelCommandInput) => client.send(new CreateAssetModelCommand(input)),
    onSuccess: () => {
      // Invalidate all lists of asset model summaries which the asset could appear in.
      queryClient.invalidateQueries(iotSiteWiseKeys.assetModelSummaryLists());
    },
  });
}
