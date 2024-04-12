import type { RequestFn } from './request-fn';
import type {
  DefaultResourceName,
  ResourceSelector,
  ResourcesProp,
} from './resource';

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
  maxResults: number;

  /** Request will be attempted when true. Default - true. */
  isEnabled?: boolean;
}

/** Options for `useListRequest` hook. */
export interface UseListRequestOptions<
  Params extends ListRequestBaseParams,
  Response extends ListRequestBaseResponse,
  Resource,
  ResourceName extends string = DefaultResourceName
> extends UseListRequestBaseOptions<Params, Response, Resource, ResourceName> {
  /** Request parameters without `nextToken` or `maxResults`. */
  params?: UseListRequestParams<Params>;
}

/** Options for `useMultipleListRequests` hook. */
export interface UseMultipleListRequestsOptions<
  Params extends ListRequestBaseParams,
  Response extends ListRequestBaseResponse,
  Resource,
  ResourceName extends string = DefaultResourceName
> extends UseListRequestBaseOptions<Params, Response, Resource, ResourceName> {
  /** List of request parameters without `nextToken` or `maxResults`. */
  paramsList?: UseListRequestParams<Params>[];
}

/**
 * Base options required for `useListRequest` and `useMultipleListRequests`
 * hooks.
 */
interface UseListRequestBaseOptions<
  Params extends ListRequestBaseParams,
  Response extends ListRequestBaseResponse,
  Resource,
  ResourceName extends string = DefaultResourceName
> extends UseListAPIBaseOptions {
  /** Unique identifier used to cache the resource. */
  resourceId: string;

  resourceName: ResourceName;

  /** Async function called with params + nextToken. */
  requestFn: RequestFn<Params, Response>;

  /** Used to get the resources from the pages. */
  resourceSelector: ResourceSelector<Response, Resource>;
}

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
  hasNextPage: boolean;

  /** True when the first page has been successfully requested. */
  isSuccess: boolean;

  /** True when the next page is being requested. */
  isLoading: boolean;

  /** Defined when there is an error. */
  error: Error | null;

  /** Call to request the next page of resources. */
  nextPage: () => void;
}

/** Result returned for `useListRequest` hook. */
export type UseListRequestResult<
  Resource,
  ResourceName extends string = DefaultResourceName
> = UseListAPIBaseResult & ResourcesProp<Resource, ResourceName>;

/** Result returned for `useMultipleListRequests` hook. */
export type UseMultipleListRequestsResult<
  Resource,
  ResourceName extends string = DefaultResourceName
> = UseListRequestResult<Resource, ResourceName>;
