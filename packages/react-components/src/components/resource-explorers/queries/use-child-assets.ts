import { useInfiniteQuery } from '@tanstack/react-query';

import type { ListAssociatedAssets } from '../types/data-source';

export interface UseChildAssetsOptions {
  assetId?: string;
  listAssociatedAssets: ListAssociatedAssets;
  pageSize: number;
}

/** Use the list of child assets for an asset with a given asset ID. */
export function useChildAssets({
  assetId,
  listAssociatedAssets,
  pageSize,
}: UseChildAssetsOptions) {
  const { data: { pages = [] } = {}, ...queryResult } = useInfiniteQuery({
    queryKey: [{ resource: 'child asset', assetId }],
    queryFn: async () => {
      const response = await listAssociatedAssets({
        assetId,
        maxResults: pageSize,
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
