import {
  ListGatewaysCommand,
  type ListGatewaysCommandInput,
  type ListGatewaysCommandOutput,
  type IoTSiteWiseServiceException,
} from '@aws-sdk/client-iotsitewise';
import { useInfiniteQuery, type UseInfiniteQueryOptions, type QueryFunctionContext } from '@tanstack/react-query';

import { iotSiteWiseKeys } from '../cache';
import type { WithClient } from '../types';

export interface UseGatewaysProps extends WithClient {
  input?: ListGatewaysCommandInput;
  options?: UseInfiniteQueryOptions<
    ListGatewaysCommandOutput,
    IoTSiteWiseServiceException,
    ListGatewaysCommandOutput,
    ListGatewaysCommandOutput,
    ReturnType<typeof iotSiteWiseKeys.gatewaySummaryList>
  >;
}

/** Use IoT SiteWise gateway summary resources. */
export function useGateways({ client, input, options }: UseGatewaysProps) {
  return useInfiniteQuery({
    ...options,
    enabled: input != null,
    queryKey: input != null ? iotSiteWiseKeys.gatewaySummaryList(input) : undefined,
    queryFn: createQueryFn({ client }),
    getNextPageParam: ({ nextToken }) => nextToken,
  });
}

function createQueryFn({ client }: WithClient) {
  return async function queryFn({
    pageParam: nextToken,
    queryKey: [input],
    signal,
  }: QueryFunctionContext<ReturnType<typeof iotSiteWiseKeys.gatewaySummaryList>>) {
    return client.send(new ListGatewaysCommand({ ...input, nextToken }), { abortSignal: signal });
  };
}
