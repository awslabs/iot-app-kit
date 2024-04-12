import { useQuery } from '@tanstack/react-query';

import { useQueryPagination } from './use-two-dimensional-pagination';
import { useCachedResources } from './use-cached-resources';
import {
  ListRequestBaseParams,
  ListRequestBaseResponse,
  UseMultipleListRequestsOptions,
  UseMultipleListRequestsResult,
} from '../../types/requests';
import { DefaultResourceName, ResourcesProp } from '../../types/resource';
import { camelCase, plural } from '../../helpers';

function removeMaxResults<Query extends { maxResults: number }>(
  query: Query
): Omit<Query, 'maxResults'> {
  const { maxResults: _maxResults, ...queryWithoutMaxResults } = query;

  return queryWithoutMaxResults;
}

/** Use paginated resources across multiple queries. */
export function useMultipleListRequests<
  Params extends ListRequestBaseParams,
  Response extends ListRequestBaseResponse,
  Resource,
  ResourceName extends string = DefaultResourceName
>({
  maxResults,
  resourceName,
  resourceId,
  paramsList = [],
  requestFn,
  resourceSelector,
  isEnabled = true,
}: UseMultipleListRequestsOptions<
  Params,
  Response,
  Resource,
  ResourceName
>): UseMultipleListRequestsResult<Resource, ResourceName> {
  const {
    query,
    hasNextPage,
    fetchNextPage: nextPage,
    loadNextToken,
  } = useQueryPagination({ queries: paramsList, defaultPageSize: maxResults });

  const queryWithoutMaxResults = removeMaxResults(query);
  const queryKey = [{ resourceId, ...queryWithoutMaxResults, maxResults }];

  const {
    isSuccess,
    isFetching: isLoading,
    error,
  } = useQuery<unknown, Error>({
    enabled: isEnabled,
    refetchOnWindowFocus: false,
    queryKey,
    queryFn: async () => {
      const response = await requestFn(query as Params);
      const resources = resourceSelector(response);

      loadNextToken({
        nextToken: response.nextToken,
        resources,
      });

      return resources;
    },
  });

  const resources = useCachedResources<Resource>({ resourceId });
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
