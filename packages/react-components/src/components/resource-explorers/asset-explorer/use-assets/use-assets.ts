import { useChildAssets } from './use-child-assets';
import { useRootAssets } from './use-root-assets';
import type {
  DescribeAsset,
  ListAssets,
  ListAssociatedAssets,
} from '../../types/data-source';
import { useAssetModelAssets } from './use-root-assets/use-asset-model-assets';

export interface UseAssetsOptions {
  /** Optional asset ID for listing child assets of the asset for the given ID. */
  assetId?: string;
  assetModelIds?: string[];
  describeAsset: DescribeAsset;
  listAssets: ListAssets;
  listAssociatedAssets: ListAssociatedAssets;
}

/** Use a list of IoT SiteWise assets. */
export function useAssets({
  assetId,
  assetModelIds = [],
  describeAsset,
  listAssets,
  listAssociatedAssets,
}: UseAssetsOptions) {
  const { assets: assetModelAssets } = useAssetModelAssets({
    assetModelIds,
    listAssets,
  });
  const {
    rootAssets,
    fetchNextPage: fetchNextPageRootAssets,
    isError: isErrorRootAssets,
    isFetching: isFetchingRootAssets,
    isLoading: isLoadingRootAssets,
    isSuccess: isSuccessRootAssets,
    hasNextPage: hasNextPageRootAssets,
    isRefetching: isRefetchingRootAssets,
    status,
    isPaused: isPausedRootAssets,
  } = useRootAssets({ listAssets });
  const {
    childAssets,
    isError: isErrorChildAssets,
    isFetching: isFetchingChildAssets,
    isLoading: isLoadingChildAssets,
    isSuccess: isSuccessChildAssets,
    isRefetching: isRefetchingChildAssets,
    isPaused: isPausedChildAssets,
  } = useChildAssets({ assetId, describeAsset, listAssociatedAssets });

  const assets =
    assetModelIds.length > 0
      ? assetModelAssets
      : assetId
      ? childAssets
      : rootAssets;
  const isError = assetId ? isErrorChildAssets : isErrorRootAssets;
  const isFetching = assetId ? isFetchingChildAssets : isFetchingRootAssets;
  const isLoading = assetId ? isLoadingChildAssets : isLoadingRootAssets;
  const isSuccess = assetId ? isSuccessChildAssets : isSuccessRootAssets;
  const fetchNextPage = assetId ? () => undefined : fetchNextPageRootAssets;
  const hasNextPage = assetId ? false : hasNextPageRootAssets;
  const isRefetching = assetId
    ? isRefetchingChildAssets
    : isRefetchingRootAssets;

  return {
    assets,
    isError,
    isFetching,
    isLoading,
    isSuccess,
    fetchNextPage,
    hasNextPage,
    isRefetching,
    status,
    isPaused: assetId ? isPausedChildAssets : isPausedRootAssets,
  };
}
