import {
  useInfiniteQuery,
  type QueryFunctionContext,
} from '@tanstack/react-query';

import type { ListAssets } from '../../../types/data-source';

export interface UseRootAssetsOptions {
  listAssets: ListAssets;
}

/** Use the paginated list of root assets. */
export function useRootAssets({ listAssets }: UseRootAssetsOptions) {
  const { data: { pages: rootAssetPages = [] } = {}, ...queryResult } =
    useInfiniteQuery({
      queryKey: createQueryKey(),
      queryFn: createQueryFn(listAssets),
      getNextPageParam: ({ nextToken }) => nextToken,
    });

  const rootAssets = rootAssetPages.flatMap(
    ({ assetSummaries = [] }) => assetSummaries
  );

  return {
    rootAssets,
    ...queryResult,
  };
}

function createQueryKey() {
  const queryKey = [{ resource: 'root asset' }] as const;

  return queryKey;
}

function createQueryFn(listAssets: ListAssets) {
  return async function ({
    pageParam: nextToken,
    signal,
  }: QueryFunctionContext<ReturnType<typeof createQueryKey>>) {
    const response = await listAssets(
      { nextToken, filter: 'TOP_LEVEL' },
      { abortSignal: signal }
    );

    return response;
  };
}
