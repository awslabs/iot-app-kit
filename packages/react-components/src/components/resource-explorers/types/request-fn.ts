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

/** First-class function used to send requests to AWS. */
export type RequestFn<Params, Response> = (
  params: Params
) => PromiseLike<Response>;

/** Utility type for extracting request function parameters. */
export type RequestParameters<F> = F extends RequestFn<
  infer Params,
  infer _Response
>
  ? Params
  : never;

/** Utility type for extracting request function response. */
export type RequestResponse<F> = F extends RequestFn<
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
 * First-class function for requesting IoT SiteWise asset model summary
 * resources from AWS.
 *
 * @see {@link https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_ListAssetModels.html}
 */
export type ListAssetModels = RequestFn<
  ListAssetModelsRequest,
  ListAssetModelsResponse
>;

/**
 * First-class function for requesting IoT SiteWise asset model property
 * summary resources from AWS.
 *
 * @see {@link https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_ListAssetModelProperties.html}
 */
export type ListAssetModelProperties = RequestFn<
  ListAssetModelPropertiesRequest,
  ListAssetModelPropertiesResponse
>;

/**
 * First-class function for requesting IoT SiteWise asset summary resources
 * from AWS.
 *
 * @see {@link https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_ListAssets.html}
 */
export type ListAssets = RequestFn<ListAssetsRequest, ListAssetsResponse>;

/**
 * First-class function for requesting IoT SiteWise associated asset summary
 * resources from AWS.
 *
 * @see {@link https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_ListAssociatedAssets.html}
 */
export type ListAssociatedAssets = RequestFn<
  ListAssociatedAssetsRequest,
  ListAssociatedAssetsResponse
>;

/**
 * First-class function for requesting IoT SiteWise time series summary
 * resources from AWS.
 *
 * @see {@link https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_ListTimeSeries.html}
 */
export type ListTimeSeries = RequestFn<
  ListTimeSeriesRequest,
  ListTimeSeriesResponse
>;

/**
 * First-class function for requesting IoT SiteWise asset property summary
 * resources from AWS.
 *
 * @see {@link https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_ListAssetProperties.html}
 */
export type ListAssetProperties = RequestFn<
  ListAssetPropertiesRequest,
  ListAssetPropertiesResponse
>;
