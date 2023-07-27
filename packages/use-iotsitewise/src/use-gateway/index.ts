import {
  DescribeGatewayCommand,
  type DescribeGatewayCommandInput,
  type DescribeGatewayCommandOutput,
  type IoTSiteWiseServiceException,
} from '@aws-sdk/client-iotsitewise';
import { useQuery, type UseQueryOptions, type QueryFunctionContext } from '@tanstack/react-query';

import { iotSiteWiseKeys } from '../cache';
import type { WithClient } from '../types';

export interface UseGatewayProps extends WithClient {
  input?: DescribeGatewayCommandInput;
  options?: UseQueryOptions<
    DescribeGatewayCommandOutput,
    IoTSiteWiseServiceException,
    DescribeGatewayCommandOutput,
    ReturnType<typeof iotSiteWiseKeys.gatewayDescription>
  >;
}

export function useGateway({ client, input, options }: UseGatewayProps) {
  return useQuery({
    enabled: input != null,
    queryKey: input != null ? iotSiteWiseKeys.gatewayDescription(input) : undefined,
    queryFn: createQueryFn({ client }),
    ...options,
  });
}

function createQueryFn({ client }: WithClient) {
  return async function queryFn({
    queryKey: [input],
    signal,
  }: QueryFunctionContext<ReturnType<typeof iotSiteWiseKeys.gatewayDescription>>) {
    return client.send(new DescribeGatewayCommand(input), { abortSignal: signal });
  };
}
