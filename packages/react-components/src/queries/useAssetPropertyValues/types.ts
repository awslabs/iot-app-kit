import {
  BatchGetAssetPropertyAggregatesRequest,
  BatchGetAssetPropertyAggregatesResponse,
  BatchGetAssetPropertyValueHistoryRequest,
  BatchGetAssetPropertyValueHistoryResponse,
  GetAssetPropertyAggregatesRequest,
  GetAssetPropertyAggregatesResponse,
  GetAssetPropertyValueHistoryRequest,
  GetAssetPropertyValueHistoryResponse,
} from '@aws-sdk/client-iotsitewise';
import {
  RequestFunction,
  RequestParameters,
  RequestResponse,
  DataPoint,
} from '@iot-app-kit/core';

export type CommonRequestParameters = {
  numberOfDataPointsToScanFor?: number;
};

/**
 * Raw data
 */
export type GetAssetPropertyValueHistoryRequestFunction = RequestFunction<
  GetAssetPropertyValueHistoryRequest,
  GetAssetPropertyValueHistoryResponse
>;

export type GetAssetPropertyValueHistoryRequestParameters =
  RequestParameters<GetAssetPropertyValueHistoryRequestFunction>;
export type GetAssetPropertyValueHistoryRequestResponse =
  RequestResponse<GetAssetPropertyValueHistoryRequestFunction>;

export type AssetPropertyValueHistoryRequest =
  GetAssetPropertyValueHistoryRequestParameters & CommonRequestParameters;

export type BatchGetAssetPropertyValueHistoryRequestFunction = RequestFunction<
  BatchGetAssetPropertyValueHistoryRequest,
  BatchGetAssetPropertyValueHistoryResponse
>;

export type BatchGetAssetPropertyValueHistoryRequestParameters =
  RequestParameters<BatchGetAssetPropertyValueHistoryRequestFunction>;
export type BatchGetAssetPropertyValueHistoryRequestResponse =
  RequestResponse<BatchGetAssetPropertyValueHistoryRequestFunction>;

export type BatchAssetPropertyValueHistoryRequest =
  BatchGetAssetPropertyValueHistoryRequestParameters & CommonRequestParameters;

/**
 * Aggregate data
 */
export type GetAssetPropertyAggregatesRequestFunction = RequestFunction<
  GetAssetPropertyAggregatesRequest,
  GetAssetPropertyAggregatesResponse
>;

export type GetAssetPropertyAggregatesRequestParameters =
  RequestParameters<GetAssetPropertyAggregatesRequestFunction>;
export type GetAssetPropertyAggregatesRequestResponse =
  RequestResponse<GetAssetPropertyAggregatesRequestFunction>;

export type AssetPropertyAggregatesRequest =
  GetAssetPropertyAggregatesRequestParameters & CommonRequestParameters;

export type BatchGetAssetPropertyAggregatesRequestFunction = RequestFunction<
  BatchGetAssetPropertyAggregatesRequest,
  BatchGetAssetPropertyAggregatesResponse
>;

export type BatchGetAssetPropertyAggregatesRequestParameters =
  RequestParameters<BatchGetAssetPropertyAggregatesRequestFunction>;
export type BatchGetAssetPropertyAggregatesRequestResponse =
  RequestResponse<BatchGetAssetPropertyAggregatesRequestFunction>;

export type BatchAssetPropertyAggregatesRequest =
  BatchGetAssetPropertyAggregatesRequestParameters & CommonRequestParameters;

/**
 * Helper types
 */
export type AssetPropertyValuesRequest =
  | AssetPropertyValueHistoryRequest
  | AssetPropertyAggregatesRequest;

export type AssetPropertyValuesData = DataPoint[];

export type AssetPropertyValuesRequestFunctions = {
  getAssetPropertyValueHistory?: GetAssetPropertyValueHistoryRequestFunction;
  batchGetAssetPropertyValueHistory?: BatchGetAssetPropertyValueHistoryRequestFunction;
  getAssetPropertyAggregates?: GetAssetPropertyAggregatesRequestFunction;
  batchGetAssetPropertyAggregates?: BatchGetAssetPropertyAggregatesRequestFunction;
};
