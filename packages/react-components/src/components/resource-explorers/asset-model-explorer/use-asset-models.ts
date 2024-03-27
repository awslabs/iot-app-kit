import type { AssetModelSummary } from '@aws-sdk/client-iotsitewise';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { usePagination } from '../helpers/paginator';
import { createBaseQueryKey, handleQueryError } from '../helpers/queries';
import type { ListAssetModels } from '../types/data-source';
import { ListAssetModelsParams } from './types';
import { Paginated } from '../types/queries';

const ASSET_MODEL_BASE_QUERY = createBaseQueryKey('asset model');

export interface UseAssetModelsOptions {
  listAssetModels: ListAssetModels;
  assetModelTypes?: ListAssetModelsParams['assetModelTypes'];
  pageSize: number;
}

export function useAssetModels({
  listAssetModels,
  assetModelTypes,
  pageSize,
}: UseAssetModelsOptions) {
  const queryClient = useQueryClient();
  const { currentQuery, hasNextPage, nextPage, syncPaginator } = usePagination({
    pageSize,
    queries: [{ assetModelTypes }],
  });

  const queryResult = useQuery({
    refetchOnWindowFocus: false,
    queryKey: createQueryKey(currentQuery),
    queryFn: async () => {
      try {
        const { assetModelSummaries = [], nextToken } = await listAssetModels(
          currentQuery ?? {}
        );

        syncPaginator({
          nextToken,
          numberOfResourcesReturned: assetModelSummaries.length,
        });

        return assetModelSummaries;
      } catch (error) {
        handleQueryError('asset models', error);
      }
    },
  });

  const queriesData = queryClient.getQueriesData<AssetModelSummary[]>(
    ASSET_MODEL_BASE_QUERY
  );
  const assetModels = queriesData.flatMap(
    ([_, assetModelSummaries = []]) => assetModelSummaries
  );

  return { ...queryResult, assetModels, hasNextPage, nextPage };
}

function createQueryKey({
  assetModelTypes,
  nextToken,
}: Paginated<{
  assetModelTypes?: ListAssetModelsParams['assetModelTypes'];
}> = {}) {
  return [
    {
      ...ASSET_MODEL_BASE_QUERY[0],
      assetModelTypes,
      nextToken,
    },
  ] as const;
}
