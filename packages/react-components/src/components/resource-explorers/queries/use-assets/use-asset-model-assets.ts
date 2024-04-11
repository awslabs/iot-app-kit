import type { AssetSummary } from '@aws-sdk/client-iotsitewise';

import { useTwoDimensionalListResources } from '../helpers/use-two-dimensional-list-resources';
import type { ListAssets } from '../../types/data-source';
import type { UseListAPIBaseOptions, UseListAPIBaseResult } from '../types';

export type UseAssetModelAssetsQuery = Required<
  Pick<Parameters<ListAssets>[0], 'assetModelId'>
>;

export interface UseAssetModelAssetsOptions extends UseListAPIBaseOptions {
  queries: UseAssetModelAssetsQuery[];
  listAssets: ListAssets;
}

export interface UseAssetModelAssetsResult extends UseListAPIBaseResult {
  assets: AssetSummary[];
}

/** Use the list of assets created from the given asset models. */
export function useAssetModelAssets({
  queries,
  maxResults,
  listAssets,
}: UseAssetModelAssetsOptions): UseAssetModelAssetsResult {
  const { resources: assets, ...responseResult } =
    useTwoDimensionalListResources({
      isEnabled: queries.length > 0,
      maxResults,
      resourceName: 'AssetSummary(model)',
      requests: queries,
      requestFn: listAssets,
      resourceSelector: ({ assetSummaries = [] }) => assetSummaries,
    });

  return { assets, ...responseResult };
}
