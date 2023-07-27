import {
  ListAssociatedAssetsCommand,
  type ListAssociatedAssetsCommandInput,
  type ListAssociatedAssetsCommandOutput,
  type IoTSiteWiseServiceException,
} from '@aws-sdk/client-iotsitewise';
import { useInfiniteQuery, type UseInfiniteQueryOptions, type QueryFunctionContext } from '@tanstack/react-query';

import { iotSiteWiseKeys } from '../cache';
import type { WithClient } from '../types';

export interface UseAssociatedAssetsProps extends WithClient {
  input: ListAssociatedAssetsCommandInput;
  options: UseInfiniteQueryOptions<
    ListAssociatedAssetsCommandOutput,
    IoTSiteWiseServiceException,
    ListAssociatedAssetsCommandOutput,
    ListAssociatedAssetsCommandOutput,
    ReturnType<typeof iotSiteWiseKeys.assetSummaryAssociatedList>
  >;
}

export function useAssociatedAssets({ client, input, options }: UseAssociatedAssetsProps) {
  return useInfiniteQuery({
    queryKey: iotSiteWiseKeys.assetSummaryAssociatedList(input),
    queryFn: createQueryFn({ client }),
    getNextPageParam: ({ nextToken }) => nextToken,
    ...options,
  });
}

function createQueryFn({ client }: WithClient) {
  return async function queryFn({
    pageParam: nextToken,
    queryKey: [input],
    signal,
  }: QueryFunctionContext<ReturnType<typeof iotSiteWiseKeys.assetSummaryAssociatedList>>) {
    return client.send(new ListAssociatedAssetsCommand({ ...input, nextToken }), { abortSignal: signal });
  };
}
