import { type AssetSummary } from '@aws-sdk/client-iotsitewise';

import { useListResources } from '../helpers/use-list-resources';
import type { UseListAPIBaseOptions, UseListAPIBaseResult } from '../types';
import type { ListAssets } from '../../types/data-source';

export interface UseRootAssetsOptions extends UseListAPIBaseOptions {
  listAssets: ListAssets;
}

export interface UseRootAssetsResult extends UseListAPIBaseResult {
  assets: AssetSummary[];
}

/**
 * Use a list of root IoT SiteWise AssetSummary resources.
 *
 * @see {@link https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_AssetSummary.html}
 */
export function useRootAssets({
  maxResults,
  listAssets,
}: UseRootAssetsOptions): UseRootAssetsResult {
  const { resources: assets, ...responseResult } = useListResources({
    resourceName: 'AssetSummary(root)',
    params: { filter: 'TOP_LEVEL', maxResults },
    requestFn: listAssets,
    resourceSelector: ({ assetSummaries = [] }) => assetSummaries,
  });

  return {
    assets,
    ...responseResult,
  };
}
