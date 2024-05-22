import { ChildAssetsRequestParameters } from '../types';
import { transformListAssetsResponse } from '../../../helpers/response-transformers';
import { useMultipleListRequests } from '../../../requests';
import type {
  UseListAPIBaseOptions,
  UseListAPIBaseResult,
} from '../../../types/requests';
import type { ListAssociatedAssets } from '../../../types/request-fn';
import type { AssetResource } from '../../../types/resources';

export interface UseChildAssetsOptions extends UseListAPIBaseOptions {
  parameters: readonly ChildAssetsRequestParameters[];
  listAssociatedAssets?: ListAssociatedAssets;
}

export interface UseChildAssetsResult extends UseListAPIBaseResult {
  assets: AssetResource[];
}

export function useChildAssets({
  parameters,
  pageSize,
  listAssociatedAssets,
}: UseChildAssetsOptions): UseChildAssetsResult {
  const { resources: assets, ...listRequestResult } = useMultipleListRequests({
    isEnabled: parameters.length > 0 && Boolean(listAssociatedAssets),
    pageSize,
    resourceId: 'Asset(child)',
    parameters,
    requestFn: listAssociatedAssets,
    responseTransformer: transformListAssetsResponse,
  });

  return { assets, ...listRequestResult };
}
