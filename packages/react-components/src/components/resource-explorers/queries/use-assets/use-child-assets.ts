import { type AssetSummary } from '@aws-sdk/client-iotsitewise';

import { useListResources } from '../helpers/use-list-resources/use-list-resources';
import type { UseListAPIBaseOptions, UseListAPIBaseResult } from '../types';
import type { ListAssociatedAssets } from '../../types/data-source';

export type UseChildAssetsQuery = Pick<
  Parameters<ListAssociatedAssets>[0],
  'assetId'
>;

export interface UseChildAssetsOptions extends UseListAPIBaseOptions {
  query?: UseChildAssetsQuery;
  listAssociatedAssets: ListAssociatedAssets;
}

export interface UseChildAssetsResult extends UseListAPIBaseResult {
  assets: AssetSummary[];
}

/**
 * Use a list of child IoT SiteWise AssetSummary resources.
 *
 * @see {@link https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_AssetSummary.html}
 */
export function useChildAssets({
  query = { assetId: '' },
  maxResults,
  listAssociatedAssets,
}: UseChildAssetsOptions): UseChildAssetsResult {
  const { resources: assets, ...responseResult } = useListResources({
    isEnabled: Boolean(query?.assetId),
    resourceName: 'AssetSummary(child)',
    params: { ...query, maxResults },
    requestFn: listAssociatedAssets,
    resourceSelector: ({ assetSummaries = [] }) => assetSummaries,
  });

  return {
    assets,
    ...responseResult,
  };
}
