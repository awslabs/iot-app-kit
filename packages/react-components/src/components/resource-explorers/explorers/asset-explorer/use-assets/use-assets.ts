import { useChildAssets } from './use-child-assets';
import { useRootAssets } from './use-root-assets';
import { useAssetModelAssets } from './use-asset-model-assets';
import { useAssetSearch } from './use-asset-search';
import {
  isAssetModelAssetsParameters,
  isChildAssetsParameters,
  isSearchedAssetsParameters,
} from '../predicates';
import type {
  AssetModelAssetsRequestParameters,
  AssetResourcesRequestParameters,
  ChildAssetsRequestParameters,
  SearchedAssetsRequestParameters,
} from '../types';
import type {
  ExecuteQuery,
  ListAssets,
  ListAssociatedAssets,
} from '@iot-app-kit/core';
import type {
  UseListAPIBaseOptions,
  UseListAPIBaseResult,
} from '../../../types/requests';
import type { AssetResource } from '../../../types/resources';

export interface UseAssetsOptions extends UseListAPIBaseOptions {
  parameters?: AssetResourcesRequestParameters;
  listAssets?: ListAssets;
  listAssociatedAssets?: ListAssociatedAssets;
  executeQuery?: ExecuteQuery;
}

export interface UseAssetsResult extends UseListAPIBaseResult {
  assets: AssetResource[];
}

/**
 * Use a list of IoT SiteWise Asset resources.
 *
 * @see {@link https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_AssetSummary.html}
 */
export function useAssets({
  parameters,
  listAssets,
  listAssociatedAssets,
  pageSize,
  executeQuery,
}: UseAssetsOptions): UseAssetsResult {
  const shouldRequestSearchedAssets =
    isEverySearchedAssetsParameters(parameters);
  const shouldRequestChildAssets = isEveryChildAssetParameters(parameters);
  const shouldRequestAssetModelAssets =
    !shouldRequestChildAssets && isEveryAssetModelAssetsParameters(parameters);
  const shouldRequestRootAssets =
    !shouldRequestAssetModelAssets &&
    !shouldRequestChildAssets &&
    parameters === undefined;

  const assetSearchResult = useAssetSearch({
    parameters: shouldRequestSearchedAssets ? parameters : [],
    pageSize,
    executeQuery,
  });

  const assetModelAssetsQueryResult = useAssetModelAssets({
    parameters: shouldRequestAssetModelAssets ? parameters : [],
    pageSize,
    listAssets,
  });

  const childAssetsQueryResult = useChildAssets({
    parameters: shouldRequestChildAssets ? parameters : [],
    pageSize,
    listAssociatedAssets,
  });

  const rootAssetsQueryResult = useRootAssets({
    isEnabled: shouldRequestRootAssets,
    pageSize,
    listAssets,
  });

  const queryResult = shouldRequestSearchedAssets
    ? assetSearchResult
    : shouldRequestAssetModelAssets
    ? assetModelAssetsQueryResult
    : shouldRequestChildAssets
    ? childAssetsQueryResult
    : shouldRequestRootAssets
    ? rootAssetsQueryResult
    : {
        assets: [],
        isLoading: false,
        error: undefined,
        hasNextPage: false,
        nextPage: () => {},
      };

  return queryResult;
}

function isEveryChildAssetParameters(
  parameters: AssetResourcesRequestParameters = []
): parameters is readonly ChildAssetsRequestParameters[] {
  return isChildAssetsParameters(parameters[0]);
}

function isEveryAssetModelAssetsParameters(
  parameters: AssetResourcesRequestParameters = []
): parameters is readonly AssetModelAssetsRequestParameters[] {
  return isAssetModelAssetsParameters(parameters[0]);
}

function isEverySearchedAssetsParameters(
  parameters: AssetResourcesRequestParameters = []
): parameters is readonly SearchedAssetsRequestParameters[] {
  return isSearchedAssetsParameters(parameters[0]);
}
