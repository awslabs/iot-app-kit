import {
  DeleteGatewayCommand,
  type DeleteGatewayCommandInput,
  type DeleteGatewayCommandOutput,
  type IoTSiteWiseServiceException,
} from '@aws-sdk/client-iotsitewise';
import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/react-query';

import { iotSiteWiseKeys } from '../cache';
import type { WithClient } from '../types';

export interface UseDeleteGatewayProps extends WithClient {
  options?: UseMutationOptions<DeleteGatewayCommandOutput, IoTSiteWiseServiceException, DeleteGatewayCommandInput>;
}

export function useDeleteGateway({ client, options }: UseDeleteGatewayProps) {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (input: DeleteGatewayCommandInput) => client.send(new DeleteGatewayCommand(input)),
    onSuccess: (_output, input) => {
      // Invalidate all lists of gateway summaries which the gateway could be in.
      queryClient.invalidateQueries(iotSiteWiseKeys.gatewaySummaryLists());
      // Invalidate the deleted asset.
      queryClient.invalidateQueries(iotSiteWiseKeys.gatewayDescription({ gatewayId: input.gatewayId }));
    },
  });
}
