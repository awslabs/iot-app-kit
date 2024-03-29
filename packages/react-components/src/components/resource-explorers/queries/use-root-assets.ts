import { useInfiniteQuery } from '@tanstack/react-query';

import type { ListAssets } from '../types/data-source';

export interface UseRootAssetsOptions {
  listAssets: ListAssets;
  pageSize: number;
}

/** Use the paginated list of root assets. */
export function useRootAssets({ listAssets, pageSize }: UseRootAssetsOptions) {
  const { data: { pages = [] } = {}, ...queryResult } = useInfiniteQuery({
    queryKey: [{ resource: 'root asset' }],
    queryFn: async () => {
      const response = await listAssets({
        maxResults: pageSize,
        filter: 'TOP_LEVEL',
      });
      return response;
    },
    getNextPageParam: ({ nextToken }) => nextToken,
  });

  const assets = pages.flatMap(({ assetSummaries = [] }) => assetSummaries);

  return {
    assets,
    ...queryResult,
  };
}
