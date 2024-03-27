import { useChildAssets } from './use-child-assets';
import { useRootAssets } from './use-root-assets';
import type {
  DescribeAsset,
  ListAssets,
  ListAssociatedAssets,
} from '../../types/data-source';
import { useAssetModelAssets } from './use-root-assets/use-asset-model-assets';

export interface UseAssetsOptions {
  /** Optional asset ID for listing child assets of the asset for the given ID. */
  assetId?: string;
  assetModelIds?: string[];
  describeAsset: DescribeAsset;
  listAssets: ListAssets;
  listAssociatedAssets: ListAssociatedAssets;
  pageSize: number;
}

/** Use a list of IoT SiteWise assets. */
export function useAssets({
  assetId,
  assetModelIds = [],
  describeAsset,
  listAssets,
  listAssociatedAssets,
  pageSize,
}: UseAssetsOptions) {
  const assetModelAssetsQueryResult = useAssetModelAssets({
    assetModelIds,
    listAssets,
    pageSize,
  });

  const childAssetsQueryResult = useChildAssets({
    assetId,
    describeAsset,
    listAssociatedAssets,
    pageSize,
  });

  const rootAssetsQueryResult = useRootAssets({
    listAssets,
    pageSize,
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
