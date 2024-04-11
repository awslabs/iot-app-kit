import type {
  ListAssetModelsRequest,
  ListAssetModelsResponse,
  ListAssetModelPropertiesRequest,
  ListAssetModelPropertiesResponse,
  ListAssetsRequest,
  ListAssetsResponse,
  ListAssociatedAssetsRequest,
  ListAssociatedAssetsResponse,
  ListAssetPropertiesRequest,
  ListAssetPropertiesResponse,
  ListTimeSeriesRequest,
  ListTimeSeriesResponse,
} from '@aws-sdk/client-iotsitewise';

/**
 * @see {@link https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_ListAssetModels.html}
 */
export type ListAssetModels = (
  request: ListAssetModelsRequest
) => PromiseLike<ListAssetModelsResponse>;

/**
 * @see {@link https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_ListAssetModelProperties.html}
 */
export type ListAssetModelProperties = (
  request: ListAssetModelPropertiesRequest
) => PromiseLike<ListAssetModelPropertiesResponse>;

/**
 * @see {@link https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_ListAssets.html}
 */
export type ListAssets = (
  request: ListAssetsRequest
) => PromiseLike<ListAssetsResponse>;

/**
 * @see {@link https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_ListAssociatedAssets.html}
 */
export type ListAssociatedAssets = (
  request: ListAssociatedAssetsRequest
) => PromiseLike<ListAssociatedAssetsResponse>;

/**
 * @see {@link https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_ListTimeSeries.html}
 */
export type ListTimeSeries = (
  request: ListTimeSeriesRequest
) => PromiseLike<ListTimeSeriesResponse>;

/**
 * @see {@link https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_ListAssetProperties.html}
 */
export type ListAssetProperties = (
  request: ListAssetPropertiesRequest
) => PromiseLike<ListAssetPropertiesResponse>;
