import type { AssetSummary } from '@aws-sdk/client-iotsitewise';

import { useMultipleListRequests } from '../use-multiple-list-requests';
import type { ListAssets } from '../../types/request-fn';
import type {
  UseListAPIBaseOptions,
  UseListAPIBaseResult,
} from '../../types/requests';
import { ASSET_NAME } from '../../constants/defaults/misc';

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
  return useMultipleListRequests({
    isEnabled: queries.length > 0,
    maxResults,
    resourceId: 'AssetSummary(model)',
    resourceName: ASSET_NAME,
    paramsList: queries,
    requestFn: listAssets,
    resourceSelector: ({ assetSummaries = [] }) => assetSummaries,
  });
}
