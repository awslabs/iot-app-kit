import { useQuery, useQueryClient, QueryOptions } from '@tanstack/react-query';
import { usePagination } from '../helpers/paginator';

export interface useInfiniteQueriesOptions<T>
  extends Omit<QueryOptions<unknown, Error>, 'queryFn' | 'queryKey'> {
  queryFn: QueryFn<T>;
  createQueryKey: CreateQueryKey<T>;
  queries: QueryParams<T>[];
  pageSize: number;
}

export type QueryFn<T> = T extends (
  params: infer Params
) => QueryFnResponse<infer Resource>
  ? (params: Params) => QueryFnResponse<Resource>
  : never;

export type QueryFnResponse<Resource> = PromiseLike<{
  nextToken?: string;
  resources: Resource[];
}>;

type QueryParams<T> = Parameters<QueryFn<T>>[0];

type QueryResource<T> = Awaited<ReturnType<QueryFn<T>>> extends QueryFnResponse<
  infer Resource
>
  ? Resource
  : never;

type CreateQueryKey<T> = (params: QueryParams<T>) => QueryKey<T>;

type QueryKey<T> = readonly [{ resource: string } & QueryParams<T>];

/** Use paginated resources across multiple queries. */
export function useInfiniteQueries<QueryFn>({
  createQueryKey,
  queryFn,
  queries,
  pageSize,
  ...queryOptions
}: useInfiniteQueriesOptions<QueryFn>) {
  const queryClient = useQueryClient();
  const { currentQuery, hasNextPage, nextPage, syncPaginator } = usePagination({
    pageSize,
    queries,
  });

  const queryKey = createQueryKey(currentQuery);

  const queryResult = useQuery<unknown, Error>({
    ...queryOptions,
    refetchOnWindowFocus: false,
    queryKey,
    queryFn: async () => {
      const { resources, nextToken } = await queryFn(currentQuery);

      syncPaginator({
        nextToken: nextToken,
        numberOfResourcesReturned: resources.length,
      });

      return resources;
    },
  });

  const resourceKey = [{ resource: queryKey[0].resource }];
  const queriesData =
    queryClient.getQueriesData<QueryResource<QueryFn>>(resourceKey);

  const resources = queriesData.flatMap(([_, rs = []]) => rs);

  return { ...queryResult, resources, hasNextPage, nextPage };
}
