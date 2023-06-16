import { useQueries, type QueryFunctionContext } from '@tanstack/react-query';
import invariant from 'tiny-invariant';

import { extractPropertiesFromAsset } from './extractPropertiesFromAsset';
import { assetKeys } from '../../data/assets';
import { describeAsset } from '../../shared/describeAsset';
import type { WithIoTSiteWiseClient } from '../../types';

export interface UseAssetPropertiesProps extends WithIoTSiteWiseClient {
  /** List of IoT SiteWise asset IDs to list properties for. */
  assetIds: string[];
}

/**
 * Use a list of asset properties for a given list of assets. The properties between assets are mixed
 * together into a single list. The order of the properties is defined by the order of the asset IDs.
 */
export function useAssetProperties({ assetIds, client }: UseAssetPropertiesProps) {
  const queries =
    useQueries({
      queries: assetIds.map((assetId) => ({
        // we store the descriptions in the cache using the assetId as the key
        queryKey: assetKeys.description({ assetId }),
        queryFn: createUseAssetPropertiesQueryFn({ client }),
        select: extractPropertiesFromAsset,
      })),
    }) ?? [];

  // we flatten the queries into a single array of properties
  const assetProperties = queries.flatMap(({ data = [] }) => data);
  // if any of the queries are fetching, then we are fetching
  const isFetching = queries.some(({ isFetching }) => isFetching);

  return { assetProperties, isFetching };
}

// curried to allow Tanstack to pass in the function context
function createUseAssetPropertiesQueryFn({ client }: WithIoTSiteWiseClient) {
  return async function ({
    queryKey: [{ assetId }],
    signal,
  }: QueryFunctionContext<ReturnType<typeof assetKeys.description>>) {
    invariant(assetId, 'Expected assetId to be defined as required by the enabled flag.');

    // asset descriptions include properties
    return describeAsset({ assetId, signal, client });
  };
}
