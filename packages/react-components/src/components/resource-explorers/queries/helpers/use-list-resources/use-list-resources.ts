import { useInfiniteQuery } from '@tanstack/react-query';

export interface UseListResourcesOptions<Request, Response, Resource> {
  /** Request will be attempted when true. Default - true. */
  isEnabled?: boolean;

  /** Unique key used to cache the resources. */
  resourceName: string;

  /** Request parameters without `nextToken`. */
  params?: Omit<Request, 'nextToken'>;

  /** Async function called with params + nextToken. */
  requestFn: (request: Request) => PromiseLike<Response>;

  /** Used to get the resources from the pages. */
  resourceSelector: (response: Response) => Resource[];
}

export interface UseListResourcesResult<Resource> {
  resources: Resource[];
  isSuccess: boolean;
  isFetching: boolean;
  hasNextPage: boolean;
  nextPage: () => void;
  error: Error | null;
}

/** Use to request paginated resources. */
export function useListResources<
  Request extends { nextToken?: string; maxResults?: number },
  Response extends { nextToken?: string },
  Resource
>({
  resourceName,
  params,
  requestFn,
  resourceSelector,
  isEnabled = true,
}: UseListResourcesOptions<
  Request,
  Response,
  Resource
>): UseListResourcesResult<Resource> {
  // Resources are scoped by `resourceName`.
  const queryKey = [{ resource: resourceName, ...params }];

  const {
    data: { pages: responses = [] } = {},
    isSuccess,
    isFetching,
    hasNextPage = false,
    fetchNextPage: nextPage,
    error,
  } = useInfiniteQuery<Response, Error, Response, typeof queryKey>({
    enabled: isEnabled,
    queryKey,
    queryFn: async ({ pageParam: nextToken }) => {
      const request: Request = {
        ...params,
        nextToken,
      } as Request;
      const response = await requestFn(request);

      return response;
    },
    getNextPageParam: ({ nextToken }) => nextToken,
  });

  const resources = responses.flatMap(resourceSelector);

  return {
    resources,
    isSuccess,
    isFetching,
    hasNextPage,
    nextPage,
    error,
  };
}
