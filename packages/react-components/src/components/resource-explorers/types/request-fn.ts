import type {
  BatchGetAssetPropertyValueRequest,
  BatchGetAssetPropertyValueResponse,
  ExecuteQueryRequest,
  ExecuteQueryResponse,
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
import type { RequestTimeout } from './common';

/** First-class function used to send requests to AWS. */
export type RequestFunction<Request, Response> = (
  request: Request,
  options?: {
    abortSignal?: AbortSignal;
    requestTimeout?: RequestTimeout;
  }
) => PromiseLike<Response>;

/** Utility type to ensure the correct structure of `requestFns`. */
export type RequestFunctions<T> = T extends Partial<
  Record<
    infer RequestFunctionName,
    RequestFunction<infer Request, infer Response>
  >
>
  ? Partial<Record<RequestFunctionName, RequestFunction<Request, Response>>>
  : never;

/** Utility type for extracting request function parameters. */
export type RequestParameters<F> = F extends RequestFunction<
  infer Params,
  infer _Response
>
  ? Params
  : never;

/** Utility type for extracting request function response. */
export type RequestResponse<F> = F extends RequestFunction<
  infer _Params,
  infer Response
>
  ? Response
  : never;

/** Utility type for extracting request function parameters by key. */
export type PickRequestParameters<
  F,
  Key extends keyof RequestParameters<F>
> = Pick<RequestParameters<F>, Key>;

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
