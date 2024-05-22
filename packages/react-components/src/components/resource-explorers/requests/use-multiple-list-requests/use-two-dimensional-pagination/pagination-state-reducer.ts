const NEXT_PAGE_ACTION_TYPE = 'next_page';
interface NextPageAction {
  type: typeof NEXT_PAGE_ACTION_TYPE;
  payload: {
    pageSize: number;
  };
}
export function createNextPageAction(pageSize: number): NextPageAction {
  return {
    type: NEXT_PAGE_ACTION_TYPE,
    payload: {
      pageSize,
    },
  };
}

const NEXT_QUERY_ACTION_TYPE = 'next_query';
interface NextQueryAction {
  type: typeof NEXT_QUERY_ACTION_TYPE;
  payload: {
    pageSize: number;
  };
}
export function createNextQueryAction(pageSize: number): NextQueryAction {
  return {
    type: NEXT_QUERY_ACTION_TYPE,
    payload: {
      pageSize,
    },
  };
}

const PREPARE_NEXT_TOKEN_ACTION_TYPE = 'prepare_next_token';
interface PrepareNextTokenAction {
  type: typeof PREPARE_NEXT_TOKEN_ACTION_TYPE;
  payload: {
    nextToken?: string;
  };
}
export function createPrepareNextTokenAction(
  nextToken?: string
): PrepareNextTokenAction {
  return {
    type: PREPARE_NEXT_TOKEN_ACTION_TYPE,
    payload: {
      nextToken,
    },
  };
}

const RESET_ACTION_TYPE = 'reset';
interface ResetAction {
  type: typeof RESET_ACTION_TYPE;
  payload: {
    pageSize: number;
  };
}
export function createResetAction(pageSize: number): ResetAction {
  return {
    type: RESET_ACTION_TYPE,
    payload: {
      pageSize,
    },
  };
}

type Actions =
  | NextPageAction
  | NextQueryAction
  | PrepareNextTokenAction
  | ResetAction;

interface PaginationState {
  nextNextToken: string | undefined;
  currentNextToken: string | undefined;
  currentMaxResults: number;
  currentQueryIndex: number;
}

export function paginationStateReducer(
  state: PaginationState,
  action: Actions
): PaginationState {
  if (action.type === NEXT_PAGE_ACTION_TYPE) {
    return {
      ...state,
      currentNextToken: state.nextNextToken,
      currentMaxResults: action.payload.pageSize,
      nextNextToken: undefined,
    };
  }

  if (action.type === NEXT_QUERY_ACTION_TYPE) {
    return {
      ...state,
      nextNextToken: undefined,
      currentNextToken: undefined,
      currentMaxResults: action.payload.pageSize,
      currentQueryIndex: state.currentQueryIndex + 1,
    };
  }

  if (action.type === PREPARE_NEXT_TOKEN_ACTION_TYPE) {
    return {
      ...state,
      nextNextToken: action.payload.nextToken,
    };
  }

  if (action.type === RESET_ACTION_TYPE) {
    return {
      nextNextToken: undefined,
      currentNextToken: undefined,
      currentMaxResults: action.payload.pageSize,
      currentQueryIndex: 0,
    };
  }

  throw new Error('Unknown action');
}
