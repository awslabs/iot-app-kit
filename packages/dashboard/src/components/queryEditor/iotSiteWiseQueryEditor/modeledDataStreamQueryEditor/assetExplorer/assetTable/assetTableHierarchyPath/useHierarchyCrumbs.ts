import {
  type AssetSummary,
  type IoTSiteWiseClient,
} from '@aws-sdk/client-iotsitewise';
import { useQuery, type QueryFunctionContext } from '@tanstack/react-query';
import invariant from 'tiny-invariant';

import { HierarchyPathCacheKeyFactory } from './hierarchyPathCacheKeyFactory';
import { ListParentAssetsRequest } from './listParentAssetsRequest';
import { useAsset } from '../../useAsset/useAsset';

export interface UseHierarchyCrumbsProps {
  /** The ID of the asset to create the hierarchy path for. */
  assetId?: string;
  client: IoTSiteWiseClient;
}

/** Use the hierarchy path for an asset with a given asset ID. */
export function useHierarchyCrumbs({
  assetId,
  client,
}: UseHierarchyCrumbsProps) {
  const { asset: { assetName = '' } = {} } = useAsset({ assetId, client });
  const cacheKeyFactory = new HierarchyPathCacheKeyFactory(assetId);

  const { data: crumbs = [], isFetching } = useQuery({
    enabled: isEnabled(assetId),
    // associated lists are used when listed assets by relationship
    queryKey: cacheKeyFactory.create(),
    queryFn: createQueryFn(client),
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

function createQueryFn(client: IoTSiteWiseClient) {
  return async function ({
    queryKey: [{ assetId }],
    signal,
  }: QueryFunctionContext<ReturnType<HierarchyPathCacheKeyFactory['create']>>) {
    invariant(
      isEnabled(assetId),
      'Expected assetId to be defined given the enabled condition.'
    );

    const request = new ListParentAssetsRequest({ assetId, client, signal });
    const response = await request.send();

    return response;
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
