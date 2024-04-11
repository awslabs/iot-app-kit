/**
 * Generalized hook options expected to be implemented by all paginated list hooks.
 *
 * @privateRemarks
 * This type is used to limit implicit dependence on Tanstack Query.
 */
export interface UseListAPIBaseOptions {
  maxResults: number;
}

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
  isFetching: boolean;

  /** Defined when there is an error. */
  error: Error | null;

  /** Call to request the next page of resources. */
  nextPage: () => void;
}
