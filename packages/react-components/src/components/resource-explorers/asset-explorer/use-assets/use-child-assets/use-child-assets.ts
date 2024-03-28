import { type AssetSummary } from '@aws-sdk/client-iotsitewise';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { useDescribedAssets } from './use-asset';
import type {
  DescribeAsset,
  ListAssociatedAssets,
} from '../../../types/data-source';
import { usePagination } from '../../../helpers/paginator';
import { useEffect, useMemo } from 'react';

const CHILD_ASSETS_QUERY_KEY = [{ resource: 'child asset' }] as const;

export interface UseChildAssetsOptions {
  assetId?: string;
  describeAsset: DescribeAsset;
  listAssociatedAssets: ListAssociatedAssets;
  pageSize: number;
}

/** Use the list of child assets for an asset with a given asset ID. */
export function useChildAssets({
  assetId,
  describeAsset,
  listAssociatedAssets,
  pageSize,
}: UseChildAssetsOptions) {
  const queryClient = useQueryClient();

  const {
    assets: [{ assetId: describedAssetId = '', assetHierarchies = [] } = {}],
  } = useDescribedAssets({
    assetIds: assetId ? [assetId] : [],
    describeAsset,
  });

  const queries = useMemo(
    () =>
      assetHierarchies.map(({ id: hierarchyId = '' }) => ({
        assetId: describedAssetId,
        hierarchyId,
      })),
    [describedAssetId]
  );

  // TODO: Page number needs to be reset when changing child assets.
  const {
    currentQuery,
    hasNextPage,
    nextPage,
    syncPaginator,
    resetNumToFillPage,
  } = usePagination({
    pageSize,
    queries,
  });

  useEffect(() => {
    resetNumToFillPage();
  }, [assetId]);

  const queryResult = useQuery<AssetSummary[], Error>({
    refetchOnWindowFocus: false,
    enabled: currentQuery != null,
    queryKey: createQueryKey(currentQuery),
    queryFn: async () => {
      const { assetSummaries = [], nextToken } = await listAssociatedAssets(
        currentQuery ?? { assetId: '' }
      );

      syncPaginator({
        nextToken,
        numberOfResourcesReturned: assetSummaries.length,
      });

      return assetSummaries;
    },
  });

  const queriesData = queryClient.getQueriesData<AssetSummary[]>([
    {
      ...CHILD_ASSETS_QUERY_KEY[0],
      assetId,
    },
  ]);
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

function createQueryKey({
  assetId,
  hierarchyId,
  nextToken,
}: {
  assetId?: string;
  hierarchyId?: string;
  nextToken?: string;
} = {}) {
  const queryKey = [
    { ...CHILD_ASSETS_QUERY_KEY[0], assetId, hierarchyId, nextToken },
  ] as const;

  return queryKey;
}
