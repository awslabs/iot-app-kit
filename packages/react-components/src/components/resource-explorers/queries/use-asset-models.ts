import { useInfiniteQuery } from '@tanstack/react-query';

import type { ListAssetModels } from '../types/data-source';
import { ListAssetModelsParams } from '../asset-model-explorer/types';

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
  const { data: { pages = [] } = {}, ...queryResult } = useInfiniteQuery({
    queryKey: [{ resource: 'asset model', assetModelTypes }],
    queryFn: async () => {
      const response = await listAssetModels({
        assetModelTypes,
        maxResults: pageSize,
      });

      return response;
    },
    getNextPageParam: ({ nextToken }) => nextToken,
  });

  const assetModels = pages.flatMap(
    ({ assetModelSummaries = [] }) => assetModelSummaries
  );

  return {
    assetModels,
    ...queryResult,
  };
}
