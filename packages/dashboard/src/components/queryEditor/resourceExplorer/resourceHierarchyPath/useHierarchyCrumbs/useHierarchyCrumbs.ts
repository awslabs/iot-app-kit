import { useQuery, type QueryFunctionContext } from '@tanstack/react-query';
import invariant from 'tiny-invariant';

import { listParentAssets } from './listParentAssets';
import { transformAssetsToCrumbs } from './transformAssetsToCrumbs';
import { useAssetDescription } from '../../useAssetDescription';
import { assetKeys } from '../../../data/assets';
import type { WithIoTSiteWiseClient } from '../../../types';

export interface UseHierarchyCrumbsProps extends WithIoTSiteWiseClient {
  /** The ID of the asset to create the hierarchy path for. */
  parentAssetId?: string;
}

/** Use the hierarchy path for an asset with a given asset ID. */
export function useHierarchyCrumbs({ parentAssetId, client }: UseHierarchyCrumbsProps) {
  const { asset: { assetName = '' } = {} } = useAssetDescription({ assetId: parentAssetId, client });

  const { data: crumbs = [], isFetching } = useQuery({
    enabled: Boolean(parentAssetId),
    // associated lists are used when listed assets by relationship
    queryKey: assetKeys.associatedList({ assetId: parentAssetId, traversalDirection: 'PARENT' }),
    queryFn: createUseHierarchyPathCrumbsQueryFn({ client }),
    // transform the assets post-request to take advantage of cached assets
    select: transformAssetsToCrumbs,
  });

  const loadingCrumb = isFetching ? [{ href: '', text: 'Loading...' }] : [];
  const ancestorCrumbs = !isFetching ? [{ href: '', text: 'Root' }, ...crumbs] : [];
  const parentAssetCrumb = !isFetching && parentAssetId ? [{ href: parentAssetId, text: assetName }] : [];

  const hierarchyPathCrumbs: { href: string; text: string }[] = [
    ...loadingCrumb,
    ...ancestorCrumbs,
    ...parentAssetCrumb,
  ];

  return { hierarchyPathCrumbs };
}

function createUseHierarchyPathCrumbsQueryFn({ client }: WithIoTSiteWiseClient) {
  return async function ({
    queryKey: [{ assetId }],
    signal,
  }: QueryFunctionContext<ReturnType<typeof assetKeys.associatedList>>) {
    invariant(assetId != null, 'Expected assetId to be defined given the enabled condition.');

    return listParentAssets({ assetId, client, signal });
  };
}
