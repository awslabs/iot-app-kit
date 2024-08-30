import type {
  BatchGetAssetPropertyValueRequest,
  BatchGetAssetPropertyValueResponse,
  BatchGetAssetPropertyValueHistoryRequest,
  BatchGetAssetPropertyValueHistoryResponse,
  DescribeAssetRequest,
  DescribeAssetResponse,
  DescribeAssetModelRequest,
  DescribeAssetModelResponse,
  ExecuteQueryRequest,
  ExecuteQueryResponse,
  GetAssetPropertyValueRequest,
  GetAssetPropertyValueResponse,
  GetAssetPropertyValueHistoryRequest,
  GetAssetPropertyValueHistoryResponse,
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
import { RequestFunction } from './common';

/**
 * First-class function for requesting the latest value of a single asset property or
 * time series resource.
 *
 * @see {@link https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_GetAssetPropertyValue.html}
 */
export type GetAssetPropertyValue = RequestFunction<
  GetAssetPropertyValueRequest,
  GetAssetPropertyValueResponse
>;

/**
 * First-class function for requesting the latest values of asset property and
 * time series resources.
 *
 * @see {@link https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_BatchGetAssetPropertyValue.html}
 */
export type BatchGetAssetPropertyValue = RequestFunction<
  BatchGetAssetPropertyValueRequest,
  BatchGetAssetPropertyValueResponse
>;

/**
 * First-class function for requesting the historical values of a single asset property or
 * time series resource.
 *
 * @see {@link https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_GetAssetPropertyValueHistory.html}
 */
export type GetAssetPropertyValueHistory = RequestFunction<
  GetAssetPropertyValueHistoryRequest,
  GetAssetPropertyValueHistoryResponse
>;

/**
 * First-class function for requesting the historical values of asset property and
 * time series resources.
 *
 * @see {@link https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_BatchGetAssetPropertyValueHistory.html}
 */
export type BatchGetAssetPropertyValueHistory = RequestFunction<
  BatchGetAssetPropertyValueHistoryRequest,
  BatchGetAssetPropertyValueHistoryResponse
>;

/**
 * First-class function for querying IoT SiteWise resources.
 *
 * @see {@link https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_ExecuteQuery.html}
 */
export type ExecuteQuery = RequestFunction<
  ExecuteQueryRequest,
  ExecuteQueryResponse
>;

/**
 * First-class function for requesting IoT SiteWise asset model summary
 * resources from AWS.
 *
 * @see {@link https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_ListAssetModels.html}
 */
export type ListAssetModels = RequestFunction<
  ListAssetModelsRequest,
  ListAssetModelsResponse
>;

/**
 * First-class function for requesting IoT SiteWise asset model property
 * summary resources from AWS.
 *
 * @see {@link https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_ListAssetModelProperties.html}
 */
export type ListAssetModelProperties = RequestFunction<
  ListAssetModelPropertiesRequest,
  ListAssetModelPropertiesResponse
>;

/**
 * First-class function for requesting IoT SiteWise asset summary resources
 * from AWS.
 *
 * @see {@link https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_ListAssets.html}
 */
export type ListAssets = RequestFunction<ListAssetsRequest, ListAssetsResponse>;

/**
 * First-class function for requesting IoT SiteWise associated asset summary
 * resources from AWS.
 *
 * @see {@link https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_ListAssociatedAssets.html}
 */
export type ListAssociatedAssets = RequestFunction<
  ListAssociatedAssetsRequest,
  ListAssociatedAssetsResponse
>;

/**
 * First-class function for requesting IoT SiteWise time series summary
 * resources from AWS.
 *
 * @see {@link https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_ListTimeSeries.html}
 */
export type ListTimeSeries = RequestFunction<
  ListTimeSeriesRequest,
  ListTimeSeriesResponse
>;

/**
 * First-class function for requesting IoT SiteWise asset property summary
 * resources from AWS.
 *
 * @see {@link https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_ListAssetProperties.html}
 */
export type ListAssetProperties = RequestFunction<
  ListAssetPropertiesRequest,
  ListAssetPropertiesResponse
>;

/**
 * First-class function for requesting a single IoT SiteWise asset summary
 * resource from AWS.
 *
 * @see {@link https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_DescribeAsset.html}
 */
export type DescribeAsset = RequestFunction<
  DescribeAssetRequest,
  DescribeAssetResponse
>;

/**
 * First-class function for requesting a single IoT SiteWise asset model summary
 * resource from AWS.
 *
 * @see {@link https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_DescribeAssetModel.html}
 */
export type DescribeAssetModel = RequestFunction<
  DescribeAssetModelRequest,
  DescribeAssetModelResponse
>;
