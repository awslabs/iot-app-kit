import type { AssetModelSummary } from '@aws-sdk/client-iotsitewise';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { usePagination } from '../helpers/paginator';
import type { ListAssetModels } from '../types/data-source';

export interface UseAssetModelsOptions {
  listAssetModels: ListAssetModels;
  assetModelTypes?: Parameters<ListAssetModels>[0]['assetModelTypes'];
}

export function useAssetModels({
  listAssetModels,
  assetModelTypes,
}: UseAssetModelsOptions) {
  const [assetModels, setAssetModels] = useState<AssetModelSummary[]>([]);
  const { currentQuery, hasNextPage, nextPage, syncPaginator } = usePagination({
    pageSize: 5,
    queries: [{ assetModelTypes }],
  });

  const queryResult = useQuery({
    refetchOnWindowFocus: false,
    queryKey: createQueryKey(currentQuery),
    queryFn: async () => {
      const { assetModelSummaries = [], nextToken } = await listAssetModels(
        currentQuery
      );

      syncPaginator({
        nextToken,
        numberOfResourcesReturned: assetModelSummaries.length,
      });

      setAssetModels((as) => [...as, ...assetModelSummaries]);
    },
  });

  return { ...queryResult, assetModels, hasNextPage, nextPage };
}

function createQueryKey({
  assetModelTypes,
  nextToken,
}: {
  assetModelTypes?: Parameters<ListAssetModels>[0]['assetModelTypes'];
  nextToken?: string;
}) {
  return [
    {
      resource: 'Asset Model',
      assetModelTypes,
      nextToken,
    },
  ] as const;
}
