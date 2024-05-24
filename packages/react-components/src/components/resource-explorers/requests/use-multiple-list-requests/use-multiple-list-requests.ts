import { useQuery } from '@tanstack/react-query';

import { useQueryPagination } from './use-two-dimensional-pagination';
import { useCachedResources } from './use-cached-resources';
import type { QueryKey } from './types';
import {
  ListRequestBaseParams,
  ListRequestBaseResponse,
  UseListAPIBaseResult,
  UseMultipleListRequestsOptions,
} from '../../types/requests';
import { resourceExplorerQueryClient } from '../resource-explorer-query-client';
import { DEFAULT_REQUEST_TIMEOUT } from '../../constants/defaults';

function removeMaxResults<
  Query extends { maxResults: number; nextToken?: string }
>(query: Query): Omit<Query, 'maxResults'> {
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
  parameters = [],
  requestFn,
  resourceId,
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
  } = useQueryPagination({ parameters, pageSize });
  const queryKey: QueryKey = [
    {
      resourceId,
      allParameters: parameters,
      currentParameters: removeMaxResults(query),
    },
  ];

  const { isFetching, error } = useQuery(
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

          loadNextToken({
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
    allParameters: parameters,
  });

  return {
    resources,
    isLoading: isFetching,
    hasNextPage,
    nextPage,
    error,
  };
}
