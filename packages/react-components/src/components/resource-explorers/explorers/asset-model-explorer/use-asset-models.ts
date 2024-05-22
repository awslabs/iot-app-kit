import type { AssetModelParameters } from './types';
import { useMultipleListRequests } from '../../requests';
import { transformListAssetModelsResponse } from '../../helpers/response-transformers';
import type {
  UseListAPIBaseOptions,
  UseListAPIBaseResult,
} from '../../types/requests';
import type { ListAssetModels } from '../../types/request-fn';
import type { AssetModelResource } from '../../types/resources';

export interface UseAssetModelsOptions extends UseListAPIBaseOptions {
  parameters: readonly AssetModelParameters[];
  listAssetModels?: ListAssetModels;
}

export interface UseAssetModelsResult extends UseListAPIBaseResult {
  assetModels: AssetModelResource[];
}

export function useAssetModels({
  pageSize,
  parameters,
  listAssetModels,
}: UseAssetModelsOptions): UseAssetModelsResult {
  const { resources: assetModels, ...listRequestResult } =
    useMultipleListRequests({
      pageSize,
      resourceId: 'AssetModel',
      parameters,
      requestFn: listAssetModels,
      responseTransformer: transformListAssetModelsResponse,
    });

  return { assetModels, ...listRequestResult };
}
