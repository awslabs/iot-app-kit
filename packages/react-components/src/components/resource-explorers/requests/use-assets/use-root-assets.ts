import { type AssetSummary } from '@aws-sdk/client-iotsitewise';

import { useListRequest } from '../use-list-request';
import type {
  UseListAPIBaseOptions,
  UseListAPIBaseResult,
} from '../../types/requests';
import type { ListAssets } from '../../types/request-fn';
import { ASSET_NAME } from '../../constants/defaults/misc';

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
  return useListRequest({
    maxResults,
    resourceId: 'AssetSummary(root)',
    resourceName: ASSET_NAME,
    params: { filter: 'TOP_LEVEL' },
    requestFn: listAssets,
    resourceSelector: ({ assetSummaries = [] }) => assetSummaries,
  });
}
