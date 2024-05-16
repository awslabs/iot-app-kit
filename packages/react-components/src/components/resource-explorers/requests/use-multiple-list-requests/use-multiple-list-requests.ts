import { useQuery } from '@tanstack/react-query';

import { useQueryPagination } from './use-two-dimensional-pagination';
import { useCachedResources } from './use-cached-resources';
import {
  ListRequestBaseParams,
  ListRequestBaseResponse,
  UseListAPIBaseResult,
  UseMultipleListRequestsOptions,
} from '../../types/requests';
import { resourceExplorerQueryClient } from '../../resource-explorer-query-client';
import { DEFAULT_REQUEST_TIMEOUT } from '../../constants/defaults';

function removeMaxResults<Query extends { maxResults: number }>(
  query: Query
): Omit<Query, 'maxResults'> {
  const { maxResults: _maxResults, ...queryWithoutMaxResults } = query;

  return queryWithoutMaxResults;
}

export interface UseMultipleListRequestsResult<Resource>
  extends UseListAPIBaseResult {
  resources: Resource[];
}

/** Use paginated resources across multiple queries. */
export function useMultipleListRequests<
  Params extends ListRequestBaseParams,
  Response extends ListRequestBaseResponse,
  Resource
>({
  pageSize,
  resourceId,
  parameters = [],
  requestFn,
  responseTransformer: resourceSelector,
  isEnabled = true,
}: UseMultipleListRequestsOptions<
  Params,
  Response,
  Resource
>): UseMultipleListRequestsResult<Resource> {
  const {
    query,
    hasNextPage,
    fetchNextPage: nextPage,
    loadNextToken,
    isChangingQueries,
  } = useQueryPagination({ parameters, pageSize: pageSize });
  // Used to ensure correct resources are pulled from cache
  const strParamsList = JSON.stringify(parameters);

  const queryWithoutMaxResults = removeMaxResults(query);
  const queryKey = [
    {
      resourceId,
      ...queryWithoutMaxResults,
      pageSize,
      stringParams: strParamsList,
    },
  ];

  const { isFetching: isLoading, error } = useQuery(
    {
      enabled: parameters.length > 0 && requestFn != null && isEnabled,
      refetchOnWindowFocus: false,
      queryKey,
      queryFn: async ({ signal }) => {
        try {
          if (!requestFn) {
            throw new Error('Exected requestFn to be defined.');
          }

          const response = await requestFn(query as Params, {
            abortSignal: signal,
            requestTimeout: DEFAULT_REQUEST_TIMEOUT,
          });
          const resources = resourceSelector(response);

          await loadNextToken({
            nextToken: response.nextToken,
            resources,
          });

          return resources;
        } catch (error) {
          console.error('Failed to request resources.', error);

          throw error;
        }
      },
    },
    resourceExplorerQueryClient
  );

  const resources = useCachedResources<Resource>({
    resourceId,
    stringParams: strParamsList,
  });

  return {
    resources,
    isLoading: isLoading || isChangingQueries,
    hasNextPage,
    nextPage,
    error,
  };
}
