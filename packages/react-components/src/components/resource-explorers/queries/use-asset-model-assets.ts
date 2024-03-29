import type { AssetSummary } from '@aws-sdk/client-iotsitewise';
import {
  UseInfiniteQueriesResult,
  useInfiniteQueries,
} from '../helpers/use-infinite-queries';
import type { ListAssets } from '../types/data-source';

type UseAssetModelAssetsQuery = Pick<Parameters<ListAssets>[0], 'assetModelId'>;

export interface UseAssetModelAssetsOptions {
  queries: UseAssetModelAssetsQuery[];
  pageSize: number;
  listAssets: ListAssets;
}

export interface UseAssetModelAssetsResult
  extends Omit<UseInfiniteQueriesResult, 'resources'> {
  assets: AssetSummary[];
}

/** Use the list of assets created from the given asset models. */
export function useAssetModelAssets({
  queries,
  pageSize,
  listAssets,
}: UseAssetModelAssetsOptions) {
  const { resources: assets, ...queryResult } = useInfiniteQueries({
    createQueryKey: (query) => [{ resource: 'asset model asset', ...query }],
    queryFn: async (params) => {
      const { assetSummaries: resources = [], nextToken } = await listAssets(
        params
      );

      return { resources, nextToken };
    },
    queries,
    pageSize,
  });

  return { assets, ...queryResult };
}
