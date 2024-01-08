import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';

import { useChildAssets } from './useChildAssets/useChildAssets';
import { useRootAssets } from './useRootAssets/useRootAssets';

export interface UseAssetsOptions {
  /** Optional asset ID for listing child assets of the asset for the given ID. */
  assetId?: string;
  client: IoTSiteWiseClient;
}

/** Use a list of IoT SiteWise assets. */
export function useAssets({ assetId, client }: UseAssetsOptions) {
  const {
    rootAssets,
    fetchNextPage: fetchNextPageRootAssets,
    isError: isErrorRootAssets,
    isFetching: isFetchingRootAssets,
    isLoading: isLoadingRootAssets,
    isSuccess: isSuccessRootAssets,
    hasNextPage: hasNextPageRootAssets,
  } = useRootAssets({ client });
  const {
    childAssets,
    isError: isErrorChildAssets,
    isFetching: isFetchingChildAssets,
    isLoading: isLoadingChildAssets,
    isSuccess: isSuccessChildAssets,
  } = useChildAssets({ assetId, client });

  const assets = assetId ? childAssets : rootAssets;
  const isError = assetId ? isErrorChildAssets : isErrorRootAssets;
  const isFetching = assetId ? isFetchingChildAssets : isFetchingRootAssets;
  const isLoading = assetId ? isLoadingChildAssets : isLoadingRootAssets;
  const isSuccess = assetId ? isSuccessChildAssets : isSuccessRootAssets;
  const fetchNextPage = assetId ? () => undefined : fetchNextPageRootAssets;
  const hasNextPage = assetId ? false : hasNextPageRootAssets;

  return {
    assets,
    isError,
    isFetching,
    isLoading,
    isSuccess,
    fetchNextPage,
    hasNextPage,
  };
}
