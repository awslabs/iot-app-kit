import type { AssetSummary } from '@aws-sdk/client-iotsitewise';

import { useChildAssets } from './use-child-assets';
import { useRootAssets } from './use-root-assets';
import { useAssetModelAssets } from './use-asset-model-assets';
import type { ListAssets, ListAssociatedAssets } from '../../types/data-source';
import type { UseListAPIBaseOptions, UseListAPIBaseResult } from '../types';

export interface UseAssetsOptions extends UseListAPIBaseOptions {
  /** Optional asset ID for listing child assets of the asset for the given ID. */
  assetId?: string;
  assetModelIds?: string[];
  listAssets: ListAssets;
  listAssociatedAssets: ListAssociatedAssets;
}

export interface UseAssetsResult extends UseListAPIBaseResult {
  assets: AssetSummary[];
}

/**
 * Use a list of IoT SiteWise AssetSummary resources.
 *
 * @see {@link https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_AssetSummary.html}
 *
 * @experimental Do not use in production.
 */
export function useAssets({
  assetId,
  assetModelIds = [],
  listAssets,
  listAssociatedAssets,
  maxResults,
}: UseAssetsOptions): UseAssetsResult {
  const assetModelAssetsQueryResult = useAssetModelAssets({
    queries: assetModelIds.map((assetModelId) => ({ assetModelId })),
    maxResults,
    listAssets,
  });

  const rootAssetsQueryResult = useRootAssets({
    maxResults,
    listAssets,
  });

  const childAssetsQueryResult = useChildAssets({
    query: { assetId },
    maxResults,
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
