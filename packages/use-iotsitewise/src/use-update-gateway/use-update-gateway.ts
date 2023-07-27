import {
  UpdateGatewayCommand,
  type UpdateGatewayCommandInput,
  type UpdateGatewayCommandOutput,
  type IoTSiteWiseServiceException,
} from '@aws-sdk/client-iotsitewise';
import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { iotSiteWiseKeys } from '../cache';
import type { WithClient } from '../types';

export interface UseUpdateGatewayProps extends WithClient {
  options?: UseMutationOptions<UpdateGatewayCommandOutput, IoTSiteWiseServiceException, UpdateGatewayCommandInput>;
}

export function useUpdateGateway({ client, options }: UseUpdateGatewayProps) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (input: UpdateGatewayCommandInput) => client.send(new UpdateGatewayCommand(input)),
    onSuccess: (_output, input) => {
      // Invalidate all lists of gateway summaries which the gateway could be in.
      queryClient.invalidateQueries(iotSiteWiseKeys.gatewaySummaryLists());
      // Invalidate the updated gateway.
      queryClient.invalidateQueries(iotSiteWiseKeys.gatewayDescription({ gatewayId: input.gatewayId }));
    },
  });
}
