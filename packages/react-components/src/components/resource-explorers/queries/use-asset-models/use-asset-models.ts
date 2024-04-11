import { type AssetModelSummary } from '@aws-sdk/client-iotsitewise';

import { useListResources } from '../helpers/use-list-resources/use-list-resources';
import type { UseListAPIBaseOptions, UseListAPIBaseResult } from '../types';
import type { ListAssetModels } from '../../types/data-source';

export type UseAssetModelsQuery = Pick<
  Parameters<ListAssetModels>[0],
  'assetModelTypes'
>;

export interface UseAssetModelsOptions extends UseListAPIBaseOptions {
  query?: UseAssetModelsQuery;
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
  query,
  maxResults,
  listAssetModels,
}: UseAssetModelsOptions): UseAssetModelsResult {
  const { resources: assetModels, ...responseResult } = useListResources({
    resourceName: 'AssetModelSummary',
    params: { ...query, maxResults },
    requestFn: listAssetModels,
    resourceSelector: ({ assetModelSummaries = [] }) => assetModelSummaries,
  });

  return {
    assetModels,
    ...responseResult,
  };
}
