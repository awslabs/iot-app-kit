import { useQuery } from '@tanstack/react-query';

import { useQueryPagination } from './use-two-dimensional-pagination';
import { useCachedResources } from './use-cached-resources';

export interface UseTwoDimensionalListResourcesOptions<
  Request,
  Response,
  Resource
> {
  maxResults: number;

  resourceName: string;

  requests: Omit<Request, 'nextToken' | 'maxResults'>[];

  /** Async function called with params + nextToken. */
  requestFn: (request: Request) => PromiseLike<Response>;

  /** Used to get the resources from the pages. */
  resourceSelector: (response: Response) => Resource[];

  isEnabled?: boolean;
}

export interface UseTwoDimensionalListResourcesResult<Resource> {
  resources: Resource[];
  isSuccess: boolean;
  isFetching: boolean;
  hasNextPage: boolean;
  nextPage: () => void;
  error: Error | null;
}

function removeMaxResults<Query extends { maxResults: number }>(
  query: Query
): Omit<Query, 'maxResults'> {
  const { maxResults: _maxResults, ...queryWithoutMaxResults } = query;

  return queryWithoutMaxResults;
}

/** Use paginated resources across multiple queries. */
export function useTwoDimensionalListResources<
  Request extends { nextToken?: string; maxResults?: number },
  Response extends { nextToken?: string },
  Resource
>({
  maxResults,
  resourceName,
  requests: queries,
  requestFn,
  resourceSelector,
  isEnabled = true,
}: UseTwoDimensionalListResourcesOptions<
  Request,
  Response,
  Resource
>): UseTwoDimensionalListResourcesResult<Resource> {
  const {
    query,
    hasNextPage,
    fetchNextPage: nextPage,
    loadNextToken,
  } = useQueryPagination({ queries, defaultPageSize: maxResults });

  const queryWithoutMaxResults = removeMaxResults(query);
  const queryKey = [{ resource: resourceName, ...queryWithoutMaxResults }];

  const { isSuccess, isFetching, error } = useQuery<unknown, Error>({
    enabled: isEnabled,
    refetchOnWindowFocus: false,
    queryKey,
    queryFn: async () => {
      const response = await requestFn(query as Request);
      const resources = resourceSelector(response);

      loadNextToken({
        nextToken: response.nextToken,
        resources,
      });

      return resources;
    },
  });

  const resources = useCachedResources<Resource>(queryKey[0]);

  return {
    resources,
    isSuccess,
    isFetching,
    hasNextPage,
    nextPage,
    error,
  };
}
