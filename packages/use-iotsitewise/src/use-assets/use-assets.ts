import {
  ListAssetsCommand,
  type ListAssetsCommandInput,
  type ListAssetsCommandOutput,
  type IoTSiteWiseServiceException,
} from '@aws-sdk/client-iotsitewise';
import { useInfiniteQuery, type UseInfiniteQueryOptions, type QueryFunctionContext } from '@tanstack/react-query';

import { iotSiteWiseKeys } from '../cache';
import type { WithClient } from '../types';

export interface UseAssetsProps extends WithClient {
  input?: ListAssetsCommandInput;
  options?: UseInfiniteQueryOptions<
    ListAssetsCommandOutput,
    IoTSiteWiseServiceException,
    ListAssetsCommandOutput,
    ListAssetsCommandOutput,
    ReturnType<typeof iotSiteWiseKeys.assetSummaryList>
  >;
}

/** Use IoT SiteWise asset summary resources. */
export function useAssets({ client, input, options }: UseAssetsProps) {
  return useInfiniteQuery({
    ...options,
    enabled: input != null,
    queryKey: input != null ? iotSiteWiseKeys.assetSummaryList(input) : undefined,
    queryFn: createQueryFn({ client }),
    getNextPageParam: ({ nextToken }) => nextToken,
  });
}

function createQueryFn({ client }: WithClient) {
  return async function queryFn({
    pageParam: nextToken,
    queryKey: [input],
    signal,
  }: QueryFunctionContext<ReturnType<typeof iotSiteWiseKeys.assetSummaryList>>) {
    return client.send(new ListAssetsCommand({ ...input, nextToken }), { abortSignal: signal });
  };
}
