import {
  useQuery,
  type UseBaseQueryOptions,
  type UseBaseQueryResult,
} from '@tanstack/react-query';

import { useQueryPagination } from './use-infinite-query-pagination';
import { useQueryResources } from './use-infinite-query-resources';

type TanstackQueryOptions = Omit<
  UseBaseQueryOptions<unknown, Error>,
  'queryFn' | 'queryKey'
>;

type QueryFn<Query, Resource> = (
  query: Query
) => Promise<{ resources: Resource[]; nextToken?: string }>;

export interface UseInfiniteQueriesOptions<Query, Resource>
  extends TanstackQueryOptions {
  queryFn: QueryFn<Query, Resource>;
  createQueryKey: (
    query: Omit<Query, 'maxResults'>
  ) => readonly [{ resource: string }];
  queries: Query[];
  pageSize: number;
}

type TanstackQueryResult = Omit<UseBaseQueryResult<unknown, Error>, 'data'>;

export interface UseInfiniteQueriesResult<Resource = unknown>
  extends TanstackQueryResult {
  resources: Resource[];
  hasNextPage: boolean;
  fetchNextPage: () => void;
}

function removeMaxResults<Query extends { maxResults: number }>(
  query: Query
): Omit<Query, 'maxResults'> {
  const { maxResults: _maxResults, ...queryWithoutMaxResults } = query;

  return queryWithoutMaxResults;
}

/** Use paginated resources across multiple queries. */
export function useInfiniteQueries<Query, Resource>({
  createQueryKey,
  queryFn,
  queries,
  pageSize: defaultPageSize,
  ...queryOptions
}: UseInfiniteQueriesOptions<
  Query,
  Resource
>): UseInfiniteQueriesResult<Resource> {
  const { query, hasNextPage, fetchNextPage, loadNextToken } =
    useQueryPagination({ queries, defaultPageSize });

  const queryWithoutMaxResults = removeMaxResults(query);
  const queryKey = createQueryKey(queryWithoutMaxResults);

  const queryResult = useQuery<unknown, Error>({
    ...queryOptions,
    refetchOnWindowFocus: false,
    queryKey,
    queryFn: async () => {
      const { resources, nextToken } = await queryFn(query);

      loadNextToken({ nextToken, resources });

      return resources;
    },
  });

  const resources = useQueryResources<Resource>({
    resource: queryKey[0].resource,
  });

  return {
    ...queryResult,
    resources,
    hasNextPage,
    fetchNextPage,
  };
}
