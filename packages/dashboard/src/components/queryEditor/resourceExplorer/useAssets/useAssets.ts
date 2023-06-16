import { useChildAssets } from './useChildAssets';
import { useRootAssets } from './useRootAssets';

import { WithIoTSiteWiseClient } from '../../types';

export interface UseAssetsProps extends WithIoTSiteWiseClient {
  /** Optional asset ID for listing child assets of the asset for the given ID. */
  assetId?: string;
}

/** Use a list of IoT SiteWise assets. */
export function useAssets({ assetId, client }: UseAssetsProps) {
  const {
    rootAssets,
    fetchNextPage: fetchNextPageRootAssets,
    isError: isErrorRootAssets,
    isFetching: isFetchingRootAssets,
    isSuccess: isSuccessRootAssets,
  } = useRootAssets({ client });
  const {
    childAssets,
    isError: isErrorChildAssets,
    isFetching: isFetchingChildAssets,
    isSuccess: isSuccessChildAssets,
  } = useChildAssets({ assetId, client });

  const assets = assetId ? childAssets : rootAssets;
  const isError = assetId ? isErrorChildAssets : isErrorRootAssets;
  const isFetching = assetId ? isFetchingChildAssets : isFetchingRootAssets;
  const isSuccess = assetId ? isSuccessChildAssets : isSuccessRootAssets;
  // FIXME: I think there's a bug in the pagination. Test before release.
  const fetchNextPage = assetId ? () => undefined : fetchNextPageRootAssets;

  return { assets, isError, isFetching, isSuccess, fetchNextPage };
}
