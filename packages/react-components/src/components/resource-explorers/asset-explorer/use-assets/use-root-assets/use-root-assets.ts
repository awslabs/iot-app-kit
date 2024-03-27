import type { AssetSummary } from '@aws-sdk/client-iotsitewise';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { usePagination } from '../../../helpers/paginator';
import type { ListAssets } from '../../../types/data-source';

const ROOT_ASSETS_QUERY_KEY = [{ resource: 'root asset' }] as const;

export interface UseRootAssetsOptions {
  listAssets: ListAssets;
  pageSize: number;
}

/** Use the paginated list of root assets. */
export function useRootAssets({ listAssets, pageSize }: UseRootAssetsOptions) {
  const queryClient = useQueryClient();
  const { currentQuery, hasNextPage, nextPage, syncPaginator } = usePagination({
    pageSize,
    queries: [{ filter: 'TOP_LEVEL' as const }],
  });

  const queryResult = useQuery({
    enabled: currentQuery != null,
    queryKey: createQueryKey(currentQuery),
    queryFn: async () => {
      const { assetSummaries = [], nextToken } = await listAssets(
        currentQuery ?? {}
      );

      syncPaginator({
        nextToken,
        numberOfResourcesReturned: assetSummaries.length,
      });

      return assetSummaries;
    },
  });

  const queriesData = queryClient.getQueriesData<AssetSummary[]>(
    ROOT_ASSETS_QUERY_KEY
  );
  const assets = queriesData.flatMap(
    ([_, assetSummaries = []]) => assetSummaries
  );

  return {
    ...queryResult,
    assets,
    hasNextPage,
    nextPage,
  };
}

function createQueryKey({ nextToken }: { nextToken?: string } = {}) {
  const queryKey = [{ ...ROOT_ASSETS_QUERY_KEY[0], nextToken }] as const;

  return queryKey;
}
