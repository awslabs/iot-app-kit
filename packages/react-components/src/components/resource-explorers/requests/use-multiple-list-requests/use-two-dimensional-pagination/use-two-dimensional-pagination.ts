import { useCallback, useMemo, useReducer, useState } from 'react';
import { flushSync } from 'react-dom';
import {
  createNextPageAction,
  createNextQueryAction,
  createPrepareNextTokenAction,
  paginationStateReducer,
} from './pagination-state-reducer';

export type UseQueryPaginationOptions<Parameters> = {
  parameters: readonly Parameters[];
  pageSize: number;
};

export function useQueryPagination<Query>({
  parameters,
  pageSize,
}: UseQueryPaginationOptions<Query>) {
  const [isChangingQueries, setIsChangingQueries] = useState(false);

  const [
    { nextNextToken, currentMaxResults, currentNextToken, currentQueryIndex },
    dispatch,
  ] = useReducer(paginationStateReducer, {
    nextNextToken: undefined,
    currentMaxResults: pageSize,
    currentNextToken: undefined,
    currentQueryIndex: 0,
  });

  function prepareNextToken(nextToken?: string) {
    dispatch(createPrepareNextTokenAction(nextToken));
  }

  function nextPage() {
    dispatch(createNextPageAction(pageSize));
  }

  function nextQuery(initialPageSize?: number) {
    dispatch(createNextQueryAction(initialPageSize ?? pageSize));
  }

  const hasNextToken: boolean = nextNextToken != null;
  const hasNextQuery: boolean = currentQueryIndex < parameters.length - 1;
  const hasNextPage: boolean = hasNextToken || hasNextQuery;

  const currentQuery = parameters[currentQueryIndex];
  const query = useMemo(
    () => ({
      ...currentQuery,
      nextToken: currentNextToken,
      maxResults: currentMaxResults,
    }),
    [currentQuery, currentNextToken, currentMaxResults]
  );

  const fetchNextPage = useCallback(async () => {
    if (hasNextToken) {
      nextPage();
    } else if (hasNextQuery) {
      nextQuery();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasNextToken, hasNextQuery]);

  const loadNextToken = useCallback(
    async ({
      nextToken,
      resources,
    }: {
      nextToken: string | undefined;
      resources: unknown[];
    }) => {
      // Prevent loading state changes from batching
      flushSync(() => {
        setIsChangingQueries(true);
        if (nextToken == null && resources.length < pageSize && hasNextQuery) {
          nextQuery(pageSize - resources.length);
        }

        prepareNextToken(nextToken);
        setIsChangingQueries(false);
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hasNextQuery, pageSize]
  );

  return {
    query,
    hasNextPage,
    fetchNextPage,
    loadNextToken,
    isChangingQueries,
  };
}

// TODO: Clear cache when queries change
