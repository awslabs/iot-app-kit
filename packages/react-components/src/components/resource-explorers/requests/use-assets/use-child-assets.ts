import { type AssetSummary } from '@aws-sdk/client-iotsitewise';

import { useListRequest } from '../use-list-request';
import type {
  UseListAPIBaseOptions,
  UseListAPIBaseResult,
} from '../../types/requests';
import type { ListAssociatedAssets } from '../../types/request-fn';
import { ASSET_NAME } from '../../constants/defaults/misc';

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
  return useListRequest({
    maxResults,
    isEnabled: Boolean(query?.assetId),
    resourceId: 'AssetSummary(child)',
    resourceName: ASSET_NAME,
    params: { ...query },
    requestFn: listAssociatedAssets,
    resourceSelector: ({ assetSummaries = [] }) => assetSummaries,
  });
}
