import { useListRequest } from '../use-list-request';
import type {
  UseListAPIBaseOptions,
  UseListAPIBaseResult,
} from '../../types/requests';
import type { ListAssets } from '../../types/request-fn';
import type { AssetResource } from '../../types/resources';
import { transformListAssetsResponse } from '../../helpers/response-transformers';

export interface UseRootAssetsOptions extends UseListAPIBaseOptions {
  listAssets?: ListAssets;
}

export interface UseRootAssetsResult extends UseListAPIBaseResult {
  assets: AssetResource[];
}

/**
 * Use a list of root IoT SiteWise AssetSummary resources.
 *
 * @see {@link https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_AssetSummary.html}
 */
export function useRootAssets({
  isEnabled,
  pageSize: maxResults,
  listAssets,
}: UseRootAssetsOptions): UseRootAssetsResult {
  const { resources: assets, ...listRequestResult } = useListRequest({
    isEnabled: isEnabled && Boolean(listAssets),
    pageSize: maxResults,
    resourceId: 'AssetSummary(root)',
    parameters: { filter: 'TOP_LEVEL' },
    requestFn: listAssets,
    responseTransformer: transformListAssetsResponse,
  });

  return { assets, ...listRequestResult };
}
