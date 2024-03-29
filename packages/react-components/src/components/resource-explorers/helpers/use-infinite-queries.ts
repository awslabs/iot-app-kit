import { useQuery, useQueryClient, QueryOptions } from '@tanstack/react-query';
import { usePagination } from '../helpers/paginator';

type UseQueryOptions = QueryOptions;
type Options = UseQueryOptions & Required<Pick<UseQueryOptions, 'queryFn'>>;

type QueryFn<T> = T extends (
  params: infer Params,
  ...args: unknown[]
) => PromiseLike<{
  nextToken?: string;
  resources: (infer R)[];
}>
  ? (
      params: Params,
      ...args: unknown[]
    ) => PromiseLike<{ nextToken?: string; resources: R[] }>
  : never;

type QueryParams<T> = Parameters<QueryFn<T>>[0];
type QueryResources<T> = Awaited<ReturnType<QueryFn<T>>> extends {
  nextToken?: string;
  resources: (infer R)[];
}
  ? R
  : never;

type QueryKey<T> = readonly [{ resource: string } & QueryParams<T>];
type CreateQueryKey<T> = (params: QueryParams<T>) => QueryKey<T>;

interface useInfiniteQueriesOptions<T> extends Options {
  createQueryKey: CreateQueryKey<T>;
  queryFn: QueryFn<T>;
  queries: QueryParams<T>[];
  pageSize: number;
}

export function useInfiniteQueries<QueryFn>({
  createQueryKey,
  queryFn,
  queries,
  pageSize,
}: useInfiniteQueriesOptions<QueryFn>) {
  const queryClient = useQueryClient();
  const { currentQuery, hasNextPage, nextPage, syncPaginator } = usePagination({
    pageSize,
    queries,
  });

  const queryKey = createQueryKey(currentQuery);
  const resourceKey = [{ resource: queryKey[0].resource }];

  const queryResult = useQuery<unknown, Error>({
    refetchOnWindowFocus: false,
    queryKey,
    queryFn: async () => {
      const { resources, nextToken } = await queryFn(currentQuery);

      console.log(resources, nextToken);

      syncPaginator({
        nextToken: nextToken,
        numberOfResourcesReturned: resources.length,
      });

      return resources;
    },
  });

  const queriesData =
    queryClient.getQueriesData<QueryResources<QueryFn>>(resourceKey);

  const resources = queriesData.flatMap(([_, rs = []]) => rs);

  return { ...queryResult, resources, hasNextPage, nextPage };
}
