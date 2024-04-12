import { useCallback, useMemo, useReducer } from 'react';
import {
  createNextPageAction,
  createNextQueryAction,
  createPrepareNextTokenAction,
  paginationStateReducer,
} from './pagination-state-reducer';
import { HookOptions } from '../../../types/helpers';

export type UseQueryPaginationOptions<Query> = HookOptions<{
  queries: Query[];
  defaultPageSize: number;
}>;

export function useQueryPagination<Query>({
  queries,
  defaultPageSize,
}: UseQueryPaginationOptions<Query>) {
  const [
    { nextNextToken, currentMaxResults, currentNextToken, currentQueryIndex },
    dispatch,
  ] = useReducer(paginationStateReducer, {
    nextNextToken: undefined,
    currentMaxResults: defaultPageSize,
    currentNextToken: undefined,
    currentQueryIndex: 0,
  });

  function prepareNextToken(nextToken?: string) {
    dispatch(createPrepareNextTokenAction(nextToken));
  }

  function nextPage() {
    dispatch(createNextPageAction(defaultPageSize));
  }

  function nextQuery(initialPageSize?: number) {
    dispatch(createNextQueryAction(initialPageSize ?? defaultPageSize));
  }

  const hasNextToken: boolean = nextNextToken != null;
  const hasNextQuery: boolean = currentQueryIndex < queries.length - 1;
  const hasNextPage: boolean = hasNextToken || hasNextQuery;

  const currentQuery = queries[currentQueryIndex];
  const query = useMemo(
    () => ({
      ...currentQuery,
      nextToken: currentNextToken,
      maxResults: currentMaxResults,
    }),
    [currentQuery, currentNextToken, currentMaxResults]
  );

  const fetchNextPage = useCallback(() => {
    if (hasNextToken) {
      nextPage();
    } else if (hasNextQuery) {
      nextQuery();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasNextToken, hasNextQuery]);

  const loadNextToken = useCallback(
    ({
      nextToken,
      resources,
    }: {
      nextToken: string | undefined;
      resources: unknown[];
    }) => {
      if (
        nextToken == null &&
        resources.length < defaultPageSize &&
        hasNextQuery
      ) {
        nextQuery(defaultPageSize - resources.length);
      }

      prepareNextToken(nextToken);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hasNextQuery, defaultPageSize]
  );

  return {
    query,
    hasNextPage,
    fetchNextPage,
    loadNextToken,
  };
}
