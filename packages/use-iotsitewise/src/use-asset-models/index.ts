import {
  ListAssetModelsCommand,
  type ListAssetModelsCommandInput,
  type ListAssetModelsCommandOutput,
  type IoTSiteWiseServiceException,
} from '@aws-sdk/client-iotsitewise';
import { useInfiniteQuery, type UseInfiniteQueryOptions, type QueryFunctionContext } from '@tanstack/react-query';

import { iotSiteWiseKeys } from '../cache';
import type { WithClient } from '../types';

export interface UseAssetModelsProps extends WithClient {
  input?: ListAssetModelsCommandInput;
  options?: UseInfiniteQueryOptions<
    ListAssetModelsCommandOutput,
    IoTSiteWiseServiceException,
    ListAssetModelsCommandOutput,
    ListAssetModelsCommandOutput,
    ReturnType<typeof iotSiteWiseKeys.assetModelSummaryList>
  >;
}

/** Use IoT SiteWise asset model summary resources. */
export function useAssetModels({ client, input, options }: UseAssetModelsProps) {
  return useInfiniteQuery({
    ...options,
    enabled: input != null,
    queryKey: input != null ? iotSiteWiseKeys.assetModelSummaryList(input) : undefined,
    queryFn: createQueryFn({ client }),
    getNextPageParam: ({ nextToken }) => nextToken,
  });
}

function createQueryFn({ client }: WithClient) {
  return async function queryFn({
    pageParam: nextToken,
    queryKey: [input],
    signal,
  }: QueryFunctionContext<ReturnType<typeof iotSiteWiseKeys.assetModelSummaryList>>) {
    return client.send(new ListAssetModelsCommand({ ...input, nextToken }), { abortSignal: signal });
  };
}
