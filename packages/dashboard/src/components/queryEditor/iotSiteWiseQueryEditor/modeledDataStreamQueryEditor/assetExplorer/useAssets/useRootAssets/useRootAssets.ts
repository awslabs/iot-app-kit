import {
  type AssetSummary,
  type IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';
import {
  useInfiniteQuery,
  type QueryFunctionContext,
} from '@tanstack/react-query';

import { ListRootAssetsRequest } from './listRootAssetsRequest';
import { RootAssetCacheKeyFactory } from './rootAssetCacheKeyFactory';

export interface UseRootAssetsOptions {
  client: IoTSiteWiseClient;
}

/** Use the paginated list of root assets. */
export function useRootAssets({ client }: UseRootAssetsOptions) {
  const cacheKeyFactory = new RootAssetCacheKeyFactory();

  const {
    data: { pages: rootAssetPages = [] } = {},
    fetchNextPage,
    hasNextPage,
    isFetching,
    isSuccess,
    status,
    isError,
    error,
    isLoading,
  } = useInfiniteQuery({
    queryKey: cacheKeyFactory.create(),
    queryFn: createUseListRootAssetsQueryFn(client),
    getNextPageParam: ({ nextToken }) => nextToken,
    initialPageParam: undefined,
  });

  const rootAssets: AssetSummary[] = rootAssetPages.flatMap(
    ({ assetSummaries = [] }) => assetSummaries
  );

  return {
    rootAssets,
    hasNextPage,
    fetchNextPage,
    isFetching,
    isSuccess,
    status,
    isError,
    isLoading,
    error,
  };
}

function createUseListRootAssetsQueryFn(client: IoTSiteWiseClient) {
  return async function ({
    pageParam: nextToken,
    signal,
  }: QueryFunctionContext<ReturnType<RootAssetCacheKeyFactory['create']>>) {
    const request = new ListRootAssetsRequest({
      nextToken: nextToken as string,
      client,
      signal,
    });
    const response = await request.send();

    return response;
  };
}
