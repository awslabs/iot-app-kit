import {
  type AssetSummary,
  ListAssociatedAssetsRequest,
  ListAssociatedAssetsResponse,
} from '@aws-sdk/client-iotsitewise';
import { useQueries, type QueryFunctionContext } from '@tanstack/react-query';
import invariant from 'tiny-invariant';

import { useDescribedAssets } from './use-asset';
import type {
  DescribeAsset,
  ListAssociatedAssets,
} from '../../../types/data-source';
import { Paginator } from '../../../helpers/paginator';

export interface UseChildAssetsOptions {
  assetId?: string;
  describeAsset: DescribeAsset;
  listAssociatedAssets: ListAssociatedAssets;
}

/** Use the list of child assets for an asset with a given asset ID. */
export function useChildAssets({
  assetId,
  describeAsset,
  listAssociatedAssets,
}: UseChildAssetsOptions) {
  const {
    assets: [{ assetHierarchies = [] } = {}],
  } = useDescribedAssets({
    assetIds: assetId ? [assetId] : [],
    describeAsset,
  });
  const hierarchyIds = selectHierarchyIds(assetHierarchies);

  const queries =
    useQueries({
      queries: hierarchyIds.map((hierarchyId) => ({
        // we need assetId and hierarchyId to make a successful request
        enabled: isEnabled(assetId, hierarchyId),
        queryKey: createQueryKey({ assetId, hierarchyId }),
        queryFn: createQueryFn(listAssociatedAssets),
      })),
    }) ?? [];

  const childAssets: AssetSummary[] = queries.flatMap(({ data = [] }) => data);
  const isError = queries.some(({ isError }) => isError);
  const isFetching = queries.some(({ isFetching }) => isFetching);
  const isLoading = queries.some(({ isLoading }) => isLoading);
  const isSuccess = queries.every(({ isSuccess }) => isSuccess);
  const isRefetching = queries.some(({ isRefetching }) => isRefetching);
  const isPaused = queries.some(({ isPaused }) => isPaused);

  return {
    childAssets,
    isError,
    isFetching,
    isLoading,
    isSuccess,
    isRefetching,
    isPaused,
  };
}

function isEnabled(
  assetId: string | undefined,
  hierarchyId: string | undefined
) {
  return isAssetId(assetId) && isHierarchyId(hierarchyId);
}

function isAssetId(assetId: string | undefined): assetId is string {
  return Boolean(assetId);
}

function isHierarchyId(hierarchyId: string | undefined): hierarchyId is string {
  return Boolean(hierarchyId);
}

/** List all of the IDs across hierarchies. */
function selectHierarchyIds(hierarchies: { id?: string }[]): string[] {
  const hierarchiesWithIds: { id: string }[] = hierarchies.filter(
    (h): h is { id: string } => Boolean(h?.id)
  );
  const hierarchyIds: string[] = hierarchiesWithIds.map(({ id }) => id);

  return hierarchyIds;
}

function createQueryKey({
  assetId,
  hierarchyId,
}: {
  assetId?: string;
  hierarchyId: string;
}) {
  const queryKey = [{ resource: 'child asset', assetId, hierarchyId }] as const;

  return queryKey;
}

function createQueryFn(listAssociatedAssets: ListAssociatedAssets) {
  // This paginator instance required specifying the type parameters. Why?
  const paginator = new Paginator<
    ListAssociatedAssetsRequest,
    ListAssociatedAssetsResponse
  >(listAssociatedAssets);

  return async function ({
    queryKey: [{ assetId, hierarchyId }],
  }: QueryFunctionContext<ReturnType<typeof createQueryKey>>) {
    invariant(
      isAssetId(assetId),
      'Expected asset ID to be defined as required by the enabled flag.'
    );
    invariant(
      isHierarchyId(hierarchyId),
      'Expected hierarchy ID to be defined as required by the enabled flag.'
    );

    const assetPages = await paginator.paginate({ assetId, hierarchyId });
    const assets = assetPages.flatMap(
      ({ assetSummaries = [] }) => assetSummaries
    );

    return assets;
  };
}
