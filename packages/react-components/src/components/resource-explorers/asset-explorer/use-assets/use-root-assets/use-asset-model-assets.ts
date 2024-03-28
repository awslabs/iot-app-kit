import { type AssetSummary } from '@aws-sdk/client-iotsitewise';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { usePagination } from '../../../helpers/paginator';
import type { ListAssets } from '../../../types/data-source';

const ROOT_ASSETS_QUERY_KEY = [{ resource: 'asset model asset' }] as const;

export interface UseAssetModelAssetsOptions {
  assetModelIds?: string[];
  listAssets: ListAssets;
  pageSize: number;
}

/** Use the list of assets created from the given asset models. */
export function useAssetModelAssets({
  assetModelIds = [],
  listAssets,
  pageSize,
}: UseAssetModelAssetsOptions) {
  const queryClient = useQueryClient();

  const queries = assetModelIds.map((assetModelId) => ({ assetModelId }));
  const { currentQuery, hasNextPage, nextPage, syncPaginator } = usePagination({
    pageSize,
    queries,
  });

  const queryResult = useQuery<AssetSummary[], Error>({
    enabled: currentQuery != null,
    queryKey: createQueryKey(currentQuery),
    queryFn: async () => {
      console.log(currentQuery);
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

  return { ...queryResult, assets, hasNextPage, nextPage };
}

function createQueryKey({
  assetModelId,
  nextToken,
}: {
  assetModelId?: string;
  nextToken?: string;
} = {}) {
  const queryKey = [
    { resource: 'root asset', assetModelId, nextToken },
  ] as const;

  return queryKey;
}
