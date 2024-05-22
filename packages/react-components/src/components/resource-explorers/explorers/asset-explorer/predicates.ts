import type {
  ChildAssetsRequestParameters,
  AssetModelAssetsRequestParameters,
  AssetResourcesRequestParameters,
  SearchedAssetsRequestParameters,
} from './types';

export function isAssetModelAssetsParameters(
  parameters?: AssetResourcesRequestParameters[number]
): parameters is AssetModelAssetsRequestParameters {
  return (
    parameters !== undefined &&
    Boolean((parameters as AssetModelAssetsRequestParameters).assetModelId)
  );
}

export function isChildAssetsParameters(
  parameters?: AssetResourcesRequestParameters[number]
): parameters is ChildAssetsRequestParameters {
  return (
    parameters !== undefined &&
    Boolean((parameters as ChildAssetsRequestParameters).assetId)
  );
}

export function isSearchedAssetsParameters(
  parameters?: AssetResourcesRequestParameters[number]
): parameters is SearchedAssetsRequestParameters {
  return (
    parameters !== undefined &&
    Boolean((parameters as SearchedAssetsRequestParameters).searchStatement)
  );
}

export function isRootAssetsParameters(
  parameters?: AssetResourcesRequestParameters[number]
): parameters is undefined {
  return parameters === undefined;
}
