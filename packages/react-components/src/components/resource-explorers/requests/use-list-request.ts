import { useInfiniteQuery } from '@tanstack/react-query';

import type {
  ListRequestBaseParams,
  ListRequestBaseResponse,
  UseListRequestOptions,
  UseListRequestResult,
} from '../types/requests';
import type { DefaultResourceName, ResourcesProp } from '../types/resource';
import { camelCase, plural } from '../helpers';

/** Use to request paginated resources. */
export function useListRequest<
  Params extends ListRequestBaseParams,
  Response extends ListRequestBaseResponse,
  Resource,
  ResourceName extends string = DefaultResourceName
>({
  maxResults,
  resourceId,
  resourceName,
  params,
  requestFn,
  resourceSelector,
  isEnabled = true,
}: UseListRequestOptions<
  Params,
  Response,
  Resource,
  ResourceName
>): UseListRequestResult<Resource, ResourceName> {
  // Resources are scoped by `resourceName`.
  const queryKey = [{ resourceId, maxResults, ...params }];

  const {
    data: { pages: responses = [] } = {},
    isSuccess,
    isFetching: isLoading,
    hasNextPage = false,
    fetchNextPage: nextPage,
    error,
  } = useInfiniteQuery<Response, Error, Response, typeof queryKey>({
    enabled: isEnabled,
    refetchOnWindowFocus: false,
    queryKey,
    queryFn: async ({ pageParam: nextToken }) => {
      const request: Params = {
        ...params,
        nextToken,
        maxResults,
      } as Params;
      const response = await requestFn(request);

      return response;
    },
    getNextPageParam: ({ nextToken }) => nextToken,
  });

  const resources = responses.flatMap(resourceSelector);
  const pluralResourceName = plural(camelCase(resourceName));
  const wrappedResources = { [pluralResourceName]: resources } as ResourcesProp<
    Resource,
    ResourceName
  >;

  return {
    ...wrappedResources,
    isSuccess,
    isLoading,
    hasNextPage,
    nextPage,
    error,
  };
}
