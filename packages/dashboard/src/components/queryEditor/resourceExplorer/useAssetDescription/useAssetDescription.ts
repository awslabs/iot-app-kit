import { useQuery, type QueryFunctionContext } from '@tanstack/react-query';
import invariant from 'tiny-invariant';

import { describeAsset } from '../../shared/describeAsset';
import { assetKeys } from '../../data/assets';
import type { WithIoTSiteWiseClient } from '../../types';

export interface UseAssetDescriptionProps extends WithIoTSiteWiseClient {
  /** The ID of the asset to describe. Requests will only be made when `assetId` is defined. */
  assetId?: string;
}

/** Use an AWS IoT SiteWise asset description. */
export function useAssetDescription({ assetId, client }: UseAssetDescriptionProps) {
  const {
    data: asset,
    status,
    isFetching,
  } = useQuery({
    // only non-empty assetIds will enable the query
    enabled: Boolean(assetId),
    queryKey: assetKeys.description({ assetId }),
    queryFn: createUseDescribeAssetQueryFn({ client }),
  });

  return { asset, status, isFetching };
}

// curried function to enable queryFn to pass in the function context
function createUseDescribeAssetQueryFn({ client }: WithIoTSiteWiseClient) {
  return async function ({
    queryKey: [{ assetId }],
    signal,
  }: QueryFunctionContext<ReturnType<typeof assetKeys.description>>) {
    invariant(assetId != null, 'Expected assetId to be defined as required by the enabled flag.');

    return describeAsset({ assetId, signal, client });
  };
}
