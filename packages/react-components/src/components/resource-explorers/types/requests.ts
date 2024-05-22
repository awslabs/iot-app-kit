import type {
  HasNextPage,
  NextPage,
  PageSize,
  RequestError,
  RequestIsLoading,
} from './common';
import type { RequestFunction } from './request-fn';

/** Minimum required parameters for a list request. */
export interface ListRequestBaseParams {
  nextToken?: string;
  maxResults?: number;
}

/** Minimum required response for a list request. */
export interface ListRequestBaseResponse {
  nextToken?: string;
}

/**
 * Generalized hook options expected to be implemented by all paginated list hooks.
 *
 * @privateRemarks
 * This type is used to limit implicit dependence on Tanstack Query.
 */
export interface UseListAPIBaseOptions {
  /** Number of resources to request per page. */
  pageSize: PageSize;

  /** Request will be attempted when true. Default - true. */
  isEnabled?: boolean;
}

/** Options for `useListRequest` hook. */
export interface UseListRequestOptions<
  Params extends ListRequestBaseParams,
  Response extends ListRequestBaseResponse,
  Resource
> extends UseListRequestBaseOptions<Params, Response, Resource> {
  /** Request parameters without `nextToken` or `maxResults`. */
  parameters?: UseListRequestParams<Params>;
}

/** Options for `useMultipleListRequests` hook. */
export interface UseMultipleListRequestsOptions<
  Params extends ListRequestBaseParams,
  Response extends ListRequestBaseResponse,
  Resource
> extends UseListRequestBaseOptions<Params, Response, Resource> {
  /** List of request parameters without `nextToken` or `maxResults`. */
  parameters?: readonly UseListRequestParams<Params>[];
}

/**
 * Base options required for `useListRequest` and `useMultipleListRequests`
 * hooks.
 */
interface UseListRequestBaseOptions<
  Params extends ListRequestBaseParams,
  Response extends ListRequestBaseResponse,
  Resource
> extends UseListAPIBaseOptions {
  /** Unique identifier used to cache the resource. */
  resourceId: string;

  /** Async function called with params + nextToken. */
  requestFn?: RequestFunction<Params, Response>;

  /** Used to transform responses into expected resource type. */
  responseTransformer: ResponseTransformer<Response, Resource>;
}

export type ResponseTransformer<Response, Resource> = (
  response: Response
) => Resource[];

/**
 * Request parameters without `nextToken` or `maxResults`.
 *
 * @remarks
 * `nextToken` is handled internally to the function for pagination and
 * `maxResults` is passed as a top-level hook option.
 */
type UseListRequestParams<Params extends ListRequestBaseParams> = Omit<
  Params,
  'nextToken' | 'maxResults'
>;

/**
 * Generalized hook result expected to be implemented by all paginated list hooks.
 *
 * @privateRemarks
 * This type is used to limit implicit dependence on Tanstack Query.
 */
export interface UseListAPIBaseResult {
  /** True when there is a next page to request. */
  hasNextPage: HasNextPage;

  /** True when the next page is being requested. */
  isLoading: RequestIsLoading;

  /** Defined when there is an error. */
  error: RequestError;

  /** Call to request the next page of resources. */
  nextPage: NextPage;
}
