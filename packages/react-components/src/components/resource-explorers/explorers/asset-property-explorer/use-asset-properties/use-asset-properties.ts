import type {
  BatchGetAssetPropertyValue,
  ExecuteQuery,
  ListAssetModelProperties,
  ListAssetProperties,
} from '@iot-app-kit/core';
import { useLatestValues } from '../../../requests/use-latest-values';
import type {
  UseListAPIBaseOptions,
  UseListAPIBaseResult,
} from '../../../types/requests';
import type { AssetPropertyResource } from '../../../types/resources';
import type {
  AssetPropertyRequestParameters,
  AssetPropertyResourcesRequestParameters,
  SearchedAssetPropertiesRequestParameters,
} from '../types';
import { useAssetPropertySearch } from './use-asset-property-search';
import { useListAssetProperties } from './use-list-asset-properties';

export interface UseAssetPropertiesOptions extends UseListAPIBaseOptions {
  parameters: AssetPropertyResourcesRequestParameters;
  batchGetAssetPropertyValue?: BatchGetAssetPropertyValue;
  executeQuery?: ExecuteQuery;
  listAssetProperties?: ListAssetProperties;
  listAssetModelProperties?: ListAssetModelProperties;
}

export interface UseAssetPropertiesResult extends UseListAPIBaseResult {
  assetProperties: AssetPropertyResource[];
}

/**
 * Use a list of IoT SiteWise AssetProperty resources.
 *
 * @see {@link https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_AssetProperty.html}
 */
export function useAssetProperties({
  parameters,
  pageSize,
  batchGetAssetPropertyValue,
  executeQuery,
  listAssetProperties,
  listAssetModelProperties,
}: UseAssetPropertiesOptions): UseAssetPropertiesResult {
  const shouldRequestSearchedAssetProperties =
    isSearchedAssetPropertyParameters(parameters);
  const shouldRequestListAssetProperties =
    isListAssetPropertyParameters(parameters);

  const assetPropertySearchResult = useAssetPropertySearch({
    parameters: shouldRequestSearchedAssetProperties ? parameters : [],
    pageSize,
    executeQuery,
  });

  const listedAssetPropertiesResult = useListAssetProperties({
    parameters: shouldRequestListAssetProperties ? parameters : [],
    pageSize,
    listAssetProperties,
    listAssetModelProperties,
  });

  const {
    assetProperties: assetPropertiesWithoutLatestValues,
    isLoadingFirstPage: isLoadingAssetPropertiesFirstPage,
    isLoadingResources: isLoadingAssetProperties,
    error,
  } = shouldRequestSearchedAssetProperties
    ? assetPropertySearchResult
    : listedAssetPropertiesResult;

  const {
    dataStreamsWithLatestValue: assetPropertiesWithLatestValues,
    isLoading: isLoadingAssetPropertiesWithLatestValues,
  } = useLatestValues({
    dataStreams: assetPropertiesWithoutLatestValues,
    batchGetAssetPropertyValue: batchGetAssetPropertyValue,
    createEntryId: ({ assetId, propertyId }) =>
      [assetId, propertyId].join('').split('-').join(''),
  });

  const isLoadingFirstPage =
    batchGetAssetPropertyValue && parameters.length !== 0 && error === null
      ? assetPropertiesWithLatestValues.length === 0 ||
        isLoadingAssetPropertiesWithLatestValues ||
        isLoadingAssetPropertiesFirstPage
      : isLoadingAssetPropertiesFirstPage;

  const isLoadingResources =
    isLoadingAssetProperties || isLoadingAssetPropertiesWithLatestValues;

  const assetProperties =
    batchGetAssetPropertyValue !== undefined
      ? assetPropertiesWithLatestValues
      : assetPropertiesWithoutLatestValues;

  return {
    assetProperties,
    isLoadingFirstPage,
    isLoadingResources,
    error,
  };
}

function isSearchedAssetPropertyParameters(
  parameters: AssetPropertyResourcesRequestParameters
): parameters is readonly SearchedAssetPropertiesRequestParameters[] {
  return (
    parameters[0] !== undefined &&
    Boolean(
      (parameters[0] as SearchedAssetPropertiesRequestParameters)
        .searchStatement
    )
  );
}

function isListAssetPropertyParameters(
  parameters: AssetPropertyResourcesRequestParameters
): parameters is readonly AssetPropertyRequestParameters[] {
  return (
    parameters[0] !== undefined &&
    Boolean((parameters[0] as AssetPropertyRequestParameters).assetId) &&
    Boolean((parameters[0] as AssetPropertyRequestParameters).assetModelId)
  );
}
