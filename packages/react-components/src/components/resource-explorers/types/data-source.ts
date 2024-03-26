import type {
  IoTSiteWise,
  BatchGetAssetPropertyValueRequest,
  BatchGetAssetPropertyValueResponse,
  DescribeAssetRequest,
  DescribeAssetResponse,
  ExecuteQueryRequest,
  ExecuteQueryResponse,
  ListAssetModelsRequest,
  ListAssetModelsResponse,
  ListAssetModelPropertiesRequest,
  ListAssetModelPropertiesResponse,
  ListAssetPropertiesRequest,
  ListAssetPropertiesResponse,
  ListTimeSeriesRequest,
  ListTimeSeriesResponse,
} from '@aws-sdk/client-iotsitewise';

/**
 * https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_BatchGetAssetPropertyValue.html
 */
export type BatchGetAssetPropertyValue = (
  request: BatchGetAssetPropertyValueRequest
) => Promise<BatchGetAssetPropertyValueResponse>;

/**
 * https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_DescribeAsset.html
 */
export type DescribeAsset = (
  params: DescribeAssetRequest
) => Promise<DescribeAssetResponse>;

/**
 * https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_ExecuteQuery.html
 */
export type ExecuteQuery = (
  request: ExecuteQueryRequest
) => Promise<ExecuteQueryResponse>;

export type ListAssetModels = (
  request: ListAssetModelsRequest
) => Promise<ListAssetModelsResponse>;

/**
 * https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_ListAssetModelProperties.html
 */
export type ListAssetModelProperties = (
  request: ListAssetModelPropertiesRequest
) => Promise<ListAssetModelPropertiesResponse>;

/**
 * https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_ListAssetProperties.html
 */
export type ListAssetProperties = (
  request: ListAssetPropertiesRequest
) => Promise<ListAssetPropertiesResponse>;

/**
 * https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_ListAssets.html
 */
export type ListAssets = IoTSiteWise['listAssets'];

/**
 * https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_ListAssociatedAssets.html
 */
export type ListAssociatedAssets = IoTSiteWise['listAssociatedAssets'];

/**
 * https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_ListTimeSeries.html
 */
export type ListTimeSeries = (
  request: ListTimeSeriesRequest
) => Promise<ListTimeSeriesResponse>;
