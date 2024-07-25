import {
  GetAssetPropertyAggregatesRequest,
  GetAssetPropertyAggregatesResponse,
  GetAssetPropertyValueHistoryRequest,
  GetAssetPropertyValueHistoryResponse,
} from '@aws-sdk/client-iotsitewise';
import {
  RequestFunction,
  RequestParameters,
  RequestResponse,
} from '../request-fn';
import { DataPoint } from '@iot-app-kit/core';

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
  GetAssetPropertyValueHistoryRequestParameters  & {
    numberOfDataPointsToScanFor?: number;
  };

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
  GetAssetPropertyAggregatesRequestParameters  & {
    numberOfDataPointsToScanFor?: number;
  };

export type AssetPropertyValuesRequest = (AssetPropertyValueHistoryRequest | AssetPropertyAggregatesRequest);

export type AssetPropertyValuesData = DataPoint[];

export type AssetPropertyValuesRequestFunctions = {
  getAssetPropertyValueHistory?: GetAssetPropertyValueHistoryRequestFunction;
  getAssetPropertyAggregates?: GetAssetPropertyAggregatesRequestFunction;
};
