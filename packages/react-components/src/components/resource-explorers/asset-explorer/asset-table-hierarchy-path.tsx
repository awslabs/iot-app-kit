import { type AssetSummary } from '@aws-sdk/client-iotsitewise';
import BreadcrumbGroup from '@cloudscape-design/components/breadcrumb-group';
import { useQuery, type QueryFunctionContext } from '@tanstack/react-query';
import React from 'react';
import { useDescribedAssets } from './use-assets/use-child-assets/use-asset';
import { DescribeAsset, ListAssociatedAssets } from '../types/data-source';
import invariant from 'tiny-invariant';

export interface AssetTableHierarchyPathProps {
  assetId?: string;
  onClickAssetName: (assetId: string) => void;
  describeAsset: DescribeAsset;
  listAssociatedAssets: ListAssociatedAssets;
}

export function AssetTableHierarchyPath({
  assetId,
  onClickAssetName,
  describeAsset,
  listAssociatedAssets,
}: AssetTableHierarchyPathProps) {
  const { hierarchyPathCrumbs } = useHierarchyCrumbs({
    assetId,
    describeAsset,
    listAssociatedAssets,
  });

  return (
    <BreadcrumbGroup
      items={hierarchyPathCrumbs}
      onClick={(event) => {
        // cancel default event
        event.preventDefault();

        const assetId = event.detail.href;
        onClickAssetName(assetId);
      }}
      ariaLabel='Asset hierarchy'
      expandAriaLabel='Show more'
    />
  );
}

interface UseHierarchyCrumbsOptions {
  assetId?: string;
  describeAsset: DescribeAsset;
  listAssociatedAssets: ListAssociatedAssets;
}

function useHierarchyCrumbs({
  assetId,
  describeAsset,
  listAssociatedAssets,
}: UseHierarchyCrumbsOptions) {
  const { assets: [{ assetName = '' } = {}] = [] } = useDescribedAssets({
    assetIds: assetId != null ? [assetId] : [],
    describeAsset,
  });

  const { data: crumbs = [], isFetching } = useQuery({
    enabled: isEnabled(assetId),
    // associated lists are used when listed assets by relationship
    queryKey: createQueryKey(assetId),
    queryFn: createQueryFn(listAssociatedAssets),
    // transform the assets post-request to take advantage of cached assets
    select: transformAssetsToCrumbs,
  });

  const loadingCrumb = isFetching ? [{ href: '', text: 'Loading...' }] : [];
  const ancestorCrumbs = !isFetching
    ? [{ href: '', text: 'Root' }, ...crumbs]
    : [];
  const parentAssetCrumb =
    !isFetching && assetId ? [{ href: assetId, text: assetName }] : [];

  const hierarchyPathCrumbs: { href: string; text: string }[] = [
    ...loadingCrumb,
    ...ancestorCrumbs,
    ...parentAssetCrumb,
  ];

  return { hierarchyPathCrumbs };
}

function isEnabled(assetId: string | undefined): assetId is string {
  return Boolean(assetId);
}

function createQueryKey(assetId?: string) {
  return [
    {
      resource: 'hierarchy path',
      assetId,
    },
  ] as const;
}

function createQueryFn(listAssociatedAssets: ListAssociatedAssets) {
  return async function ({
    queryKey: [{ assetId }],
  }: QueryFunctionContext<ReturnType<typeof createQueryKey>>) {
    invariant(
      isEnabled(assetId),
      'Expected assetId to be defined given the enabled condition.'
    );

    const iterator = createIterator(listAssociatedAssets);

    const parentAssets = await iterator(assetId);

    return parentAssets;
  };
}

function createIterator(listAssociatedAssets: ListAssociatedAssets) {
  return async function recursivelyGetParents(
    assetId: string,
    parentAssets: AssetSummary[] = []
  ): Promise<AssetSummary[]> {
    const { assetSummaries: [parentAsset] = [] } = await listAssociatedAssets({
      assetId,
      traversalDirection: 'PARENT',
    });

    if (parentAsset == null || parentAsset.id == null) {
      return parentAssets;
    }

    return recursivelyGetParents(parentAsset.id, [
      parentAsset,
      ...parentAssets,
    ]);
  };
}

function transformAssetsToCrumbs(
  assets: AssetSummary[]
): { href: string; text: string }[] {
  const crumbs = assets.map(({ id = '', name = '' }) => ({
    href: id,
    text: name,
  }));

  return crumbs;
}
