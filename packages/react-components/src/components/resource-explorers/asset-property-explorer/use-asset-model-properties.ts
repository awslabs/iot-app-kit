import { type AssetModelPropertySummary } from '@aws-sdk/client-iotsitewise';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { usePagination } from '../helpers/paginator';
import type { ListAssetModelProperties } from '../types/data-source';

export interface UseAssetModelPropertiesOptions {
  assetModelIds: string[];
  listAssetModelProperties?: ListAssetModelProperties;
  pageSize: number;
}

export function useAssetModelProperties({
  assetModelIds,
  listAssetModelProperties,
  pageSize,
}: UseAssetModelPropertiesOptions) {
  const queryClient = useQueryClient();
  const { currentQuery, hasNextPage, nextPage, syncPaginator } = usePagination({
    pageSize,
    queries: assetModelIds.map((assetModelId) => ({ assetModelId })),
    unravel: true,
  });

  const queryResult = useQuery<AssetModelPropertySummary[], Error>({
    refetchOnWindowFocus: false,
    enabled: listAssetModelProperties != null && currentQuery != null,
    queryKey: createQueryKey(currentQuery),
    queryFn: async () => {
      if (!currentQuery || !listAssetModelProperties) {
        throw new Error('Expected currentQuery to be defined.');
      }
      const { assetModelPropertySummaries = [], nextToken } =
        await listAssetModelProperties(currentQuery ?? {});

      console.log(assetModelPropertySummaries);

      syncPaginator({
        nextToken,
        numberOfResourcesReturned: assetModelPropertySummaries.length,
      });

      return assetModelPropertySummaries;
    },
  });

  const queriesData = queryClient.getQueriesData<AssetModelPropertySummary[]>([
    { resource: 'asset model property' },
  ]);
  const assetModelProperties = queriesData.flatMap(([_, amp = []]) => amp);

  return { ...queryResult, assetModelProperties, hasNextPage, nextPage };
}

function createQueryKey({
  assetId,
  nextToken,
}: {
  assetId?: string;
  nextToken?: string;
} = {}) {
  return [{ resource: 'asset model property', assetId, nextToken }] as const;
}
