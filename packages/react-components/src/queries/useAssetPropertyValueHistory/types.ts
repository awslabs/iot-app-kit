import {
  GetAssetPropertyValueHistoryRequest,
  GetAssetPropertyValueHistoryResponse,
} from '@aws-sdk/client-iotsitewise';
import {
  RequestFunction,
  RequestParameters,
  RequestResponse,
} from '../request-fn';

export type GetAssetPropertyValueHistoryRequestFunction = RequestFunction<
  GetAssetPropertyValueHistoryRequest,
  GetAssetPropertyValueHistoryResponse
>;

export type GetAssetPropertyValueHistoryRequestParameters =
  RequestParameters<GetAssetPropertyValueHistoryRequestFunction>;
export type GetAssetPropertyValueHistoryRequestResponse =
  RequestResponse<GetAssetPropertyValueHistoryRequestFunction>;

export type AssetPropertyValueHistoryRequest =
  GetAssetPropertyValueHistoryRequestParameters & {
    numberOfDataPointsToScanFor?: number;
  };
export type AssetPropertyValueHistoryData = NonNullable<
  GetAssetPropertyValueHistoryRequestResponse['assetPropertyValueHistory']
>;
