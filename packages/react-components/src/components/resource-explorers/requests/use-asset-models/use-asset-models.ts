import { type AssetModelSummary } from '@aws-sdk/client-iotsitewise';

import { useListRequest } from '../use-list-request';
import type {
  UseListAPIBaseOptions,
  UseListAPIBaseResult,
} from '../../types/requests';
import type { ListAssetModels } from '../../types/request-fn';
import type { PickRequestParameters } from '../../types/request-fn';
import { ASSET_MODEL_NAME } from '../../constants/defaults/misc';

export type UseAssetModelsQuery = PickRequestParameters<
  ListAssetModels,
  'assetModelTypes'
>;

export interface UseAssetModelsOptions extends UseListAPIBaseOptions {
  params?: UseAssetModelsQuery;
  listAssetModels: ListAssetModels;
}

export interface UseAssetModelsResult extends UseListAPIBaseResult {
  assetModels: AssetModelSummary[];
}

/**
 * Use a list of IoT SiteWise AssetModelSummary resources.
 *
 * @see {@link https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_AssetModelSummary.html}
 *
 * @experimental Do not use in production.
 */
export function useAssetModels({
  params,
  maxResults,
  listAssetModels,
}: UseAssetModelsOptions): UseAssetModelsResult {
  return useListRequest({
    maxResults,
    resourceId: 'AssetModelSummary',
    resourceName: ASSET_MODEL_NAME,
    params,
    requestFn: listAssetModels,
    resourceSelector: ({ assetModelSummaries = [] }) => assetModelSummaries,
  });
}
