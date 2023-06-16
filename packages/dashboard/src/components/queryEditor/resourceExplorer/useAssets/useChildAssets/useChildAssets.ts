import { type AssetSummary } from '@aws-sdk/client-iotsitewise';
import { useQueries, type QueryFunctionContext } from '@tanstack/react-query';
import invariant from 'tiny-invariant';

import { CHILD_ASSETS_LIST_TRAVERSAL_DIRECTION } from './constants';
import { listChildAssets } from './listChildAssets';
import { selectHierarchyIds } from './selectHierarchyIds';
import { useAssetDescription } from '../../useAssetDescription';
import { assetKeys } from '../../../data/assets';
import type { WithIoTSiteWiseClient } from '../../../types';

export interface UseChildAssetsProps extends WithIoTSiteWiseClient {
  /** Asset ID to list children for. Queries are not active until the asset ID is set. */
  assetId?: string;
}

/** Use the list of child assets for an asset with a given asset ID. */
export function useChildAssets({ assetId, client }: UseChildAssetsProps) {
  const { asset: { assetHierarchies = [] } = {} } = useAssetDescription({ assetId, client });
  const hierarchyIds = selectHierarchyIds(assetHierarchies);

  const queries =
    useQueries({
      queries: hierarchyIds.map((hierarchyId) => ({
        // we need assetId and hierarchyId to make a successful request
        enabled: Boolean(assetId) && Boolean(hierarchyId),
        queryKey: assetKeys.associatedList({
          assetId,
          hierarchyId,
          traversalDirection: CHILD_ASSETS_LIST_TRAVERSAL_DIRECTION,
        }),
        queryFn: createUseChildAssetsQueryFn({ client }),
      })),
    }) ?? [];

  const childAssets: AssetSummary[] = queries.flatMap(({ data = [] }) => data);
  const isError = queries.some(({ isError }) => isError);
  const isFetching = queries.some(({ isFetching }) => isFetching);
  const isSuccess = queries.every(({ isSuccess }) => isSuccess);

  return { childAssets, isError, isFetching, isSuccess };
}

function createUseChildAssetsQueryFn({ client }: WithIoTSiteWiseClient) {
  return async function ({
    queryKey: [{ assetId, hierarchyId }],
    signal,
  }: QueryFunctionContext<ReturnType<typeof assetKeys.associatedList>>) {
    invariant(assetId != null, 'Expected asset ID to be defined as required by the enabled flag.');
    invariant(hierarchyId != null, 'Expected hierarchy ID to be defined as required by the enabled flag.');

    return listChildAssets({ assetId, hierarchyId, signal, client });
  };
}
