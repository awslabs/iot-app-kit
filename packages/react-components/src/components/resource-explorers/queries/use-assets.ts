import { useChildAssets } from './use-child-assets';
import { useRootAssets } from './use-root-assets';
import { useAssetModelAssets } from './use-asset-model-assets';
import type { ListAssets, ListAssociatedAssets } from '../types/data-source';

export interface UseAssetsOptions {
  /** Optional asset ID for listing child assets of the asset for the given ID. */
  assetId?: string;
  assetModelIds?: string[];
  listAssets: ListAssets;
  listAssociatedAssets: ListAssociatedAssets;
  pageSize: number;
}

/** Use a list of IoT SiteWise assets. */
export function useAssets({
  assetId,
  assetModelIds = [],
  listAssets,
  listAssociatedAssets,
  pageSize,
}: UseAssetsOptions) {
  const assetModelAssetsQueryResult = useAssetModelAssets({
    queries: assetModelIds.map((assetModelId) => ({ assetModelId })),
    pageSize,
    listAssets,
  });

  const rootAssetsQueryResult = useRootAssets({
    pageSize,
    listAssets,
  });

  const childAssetsQueryResult = useChildAssets({
    assetId,
    pageSize,
    listAssociatedAssets,
  });

  const shouldReturnAssetModelAssetsQueryResult = assetModelIds.length > 0;
  const shouldReturnChildAssetsQueryResult = assetId != null;

  const queryResult = shouldReturnAssetModelAssetsQueryResult
    ? assetModelAssetsQueryResult
    : shouldReturnChildAssetsQueryResult
    ? childAssetsQueryResult
    : rootAssetsQueryResult;

  return queryResult;
}
