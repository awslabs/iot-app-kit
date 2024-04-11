import { useCallback, useReducer } from 'react';

interface NextPageAction {
  type: 'next_page';
  payload: {
    pageSize: number;
  };
}

interface NextQueryAction {
  type: 'next_query';
  payload: {
    pageSize: number;
  };
}

interface PrepareNextTokenAction {
  type: 'prepare_next_token';
  payload: {
    nextToken?: string;
  };
}

type Actions = NextPageAction | NextQueryAction | PrepareNextTokenAction;

interface ReducerState {
  nextNextToken: string | undefined;
  currentNextToken: string | undefined;
  currentMaxResults: number;
  currentQueryIndex: number;
}

function reducer(state: ReducerState, action: Actions): ReducerState {
  if (action.type === 'next_page') {
    return {
      ...state,
      currentNextToken: state.nextNextToken,
      currentMaxResults: action.payload.pageSize,
      nextNextToken: undefined,
    };
  }

  if (action.type === 'next_query') {
    return {
      ...state,
      nextNextToken: undefined,
      currentNextToken: undefined,
      currentMaxResults: action.payload.pageSize,
      currentQueryIndex: state.currentQueryIndex + 1,
    };
  }

  if (action.type === 'prepare_next_token') {
    return {
      ...state,
      nextNextToken: action.payload.nextToken,
    };
  }

  throw new Error('Unknown action');
}

export interface UseQueryPaginationOptions<Query> {
  queries: Query[];
  defaultPageSize: number;
}

export function useQueryPagination<Query>({
  queries,
  defaultPageSize,
}: UseQueryPaginationOptions<Query>) {
  const [
    { nextNextToken, currentMaxResults, currentNextToken, currentQueryIndex },
    dispatch,
  ] = useReducer(reducer, {
    nextNextToken: undefined,
    currentMaxResults: defaultPageSize,
    currentNextToken: undefined,
    currentQueryIndex: 0,
  });

  function prepareNextToken(nextToken?: string) {
    dispatch({
      type: 'prepare_next_token',
      payload: { nextToken },
    });
  }

  function nextPage() {
    dispatch({
      type: 'next_page',
      payload: { pageSize: defaultPageSize },
    });
  }

  function nextQuery(initialPageSize?: number) {
    dispatch({
      type: 'next_query',
      payload: {
        pageSize: initialPageSize ?? defaultPageSize,
      },
    });
  }

  const hasNextToken: boolean = nextNextToken != null;
  const hasNextQuery: boolean = currentQueryIndex < queries.length - 1;
  const hasNextPage: boolean = hasNextToken || hasNextQuery;

  const currentQuery = queries[currentQueryIndex];
  const query = {
    ...currentQuery,
    nextToken: currentNextToken,
    maxResults: currentMaxResults,
  };

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
