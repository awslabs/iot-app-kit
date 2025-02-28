import { type AssetModelAssetsRequestParameters } from '../types';
import { useMultipleListRequests } from '../../../requests';
import type { ListAssets } from '@iot-app-kit/core';
import type {
  UseListAPIBaseOptions,
  UseListAPIBaseResult,
} from '../../../types/requests';
import type { AssetResource } from '../../../types/resources';
import { transformListAssetsResponse } from '../../../helpers/response-transformers';

export interface UseAssetModelAssetsOptions extends UseListAPIBaseOptions {
  parameters: readonly AssetModelAssetsRequestParameters[];
  listAssets?: ListAssets;
}

export interface UseAssetModelAssetsResult extends UseListAPIBaseResult {
  assets: AssetResource[];
}

/** Use the list of assets created from the given asset models. */
export function useAssetModelAssets({
  parameters,
  pageSize,
  listAssets,
}: UseAssetModelAssetsOptions): UseAssetModelAssetsResult {
  const { resources: assets, ...listRequestResult } = useMultipleListRequests({
    isEnabled: parameters.length > 0 && Boolean(listAssets),
    pageSize,
    resourceId: 'Asset(model)',
    parameters,
    requestFn: listAssets,
    responseTransformer: transformListAssetsResponse,
  });

  return { assets, ...listRequestResult };
}
