import { type AssetSummary } from '@aws-sdk/client-iotsitewise';
import { useInfiniteQuery, type QueryFunctionContext } from '@tanstack/react-query';

import { listRootAssets } from './listRootAssets';
import { assetKeys } from '../../../data/assets';
import type { WithIoTSiteWiseClient } from '../../../types';

export type UseRootAssetsProps = WithIoTSiteWiseClient;

/** Use the paginated list of root assets. */
export function useRootAssets({ client }: UseRootAssetsProps) {
  const {
    data: { pages: rootAssetPages = [] } = {},
    fetchNextPage,
    hasNextPage,
    isFetching,
    isSuccess,
    status,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: assetKeys.list({ filter: 'TOP_LEVEL' }),
    queryFn: createUseListRootAssetsQueryFn({ client }),
    getNextPageParam: ({ nextToken }) => nextToken,
  });

  const rootAssets: AssetSummary[] = rootAssetPages.flatMap(({ assetSummaries = [] }) => assetSummaries);

  return { rootAssets, hasNextPage, fetchNextPage, isFetching, isSuccess, status, isError, error };
}

function createUseListRootAssetsQueryFn({ client }: WithIoTSiteWiseClient) {
  return async function ({ pageParam: nextToken, signal }: QueryFunctionContext<ReturnType<typeof assetKeys.list>>) {
    return listRootAssets({ nextToken, signal, client });
  };
}
