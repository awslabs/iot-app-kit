import {
  CreateGatewayCommand,
  type CreateGatewayCommandInput,
  type CreateGatewayCommandOutput,
  type IoTSiteWiseServiceException,
} from '@aws-sdk/client-iotsitewise';
import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { iotSiteWiseKeys } from '../cache';
import type { WithClient } from '../types';

export interface UseCreateGatewayProps extends WithClient {
  options?: UseMutationOptions<CreateGatewayCommandOutput, IoTSiteWiseServiceException, CreateGatewayCommandInput>;
}

/** Use to create IoT SiteWise gateway resources. */
export function useCreateGateway({ client, options }: UseCreateGatewayProps) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (input: CreateGatewayCommandInput) => client.send(new CreateGatewayCommand(input)),
    onSuccess: () => {
      // Invalidate all lists of gateway summaries which the gateway could appear in.
      queryClient.invalidateQueries(iotSiteWiseKeys.gatewaySummaryLists());
    },
  });
}
