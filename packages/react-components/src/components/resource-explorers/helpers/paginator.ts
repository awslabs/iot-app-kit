import { useRef, useState } from 'react';

type Paginated = { nextToken?: string };

/** Recursive AWS list paginator. */
export class Paginator<Request extends Paginated, Response extends Paginated> {
  readonly #fn: (params: Request) => Promise<Response>;

  constructor(fn: (params: Request) => Promise<Response>) {
    this.#fn = fn;
  }

  async paginate(params: Request): Promise<Response[]> {
    const response = await this.#fn(params);

    if (response.nextToken) {
      const nextPage = await this.paginate({
        ...params,
        nextToken: response.nextToken,
      });

      return [response, ...nextPage];
    } else {
      return [response];
    }
  }
}

interface UsePaginationOptions<T> {
  pageSize: number;
  queries: T[];
  unravel?: boolean;
}

export function usePagination<T>({
  pageSize,
  queries,
  unravel,
}: UsePaginationOptions<T>) {
  /** Number of resources remaining to fill page. Ref used to prevent re-renders when changed. */
  const numToFillPage = useRef<number>(pageSize);

  /** Used for switching the current query being request. */
  const [currentQueryIndex, setCurrentQueryIndex] = useState<number>(0);

  /** The current pagination token. */
  const [currentNextToken, setCurrentNextToken] = useState<string | undefined>(
    undefined
  );

  /** The pagination token which will be used when nextPage() is called. */
  const [nextNextToken, setNextNextToken] = useState<string | undefined>(
    undefined
  );

  /** The current query being requested. */
  const currentQuery =
    queries.length > 0
      ? {
          ...queries[currentQueryIndex],
          nextToken: currentNextToken,
          maxResults: numToFillPage.current,
        }
      : undefined;

  const isNextNextToken = nextNextToken != null;
  const isNextQuery = currentQueryIndex < queries.length - 1;

  /** Boolean indicating there are more pages to request. */
  const hasNextPage = isNextNextToken || isNextQuery;

  /** Call to paginate. */
  function nextPage(): void {
    if (hasNextPage) {
      if (isNextNextToken) {
        setCurrentNextToken(nextNextToken);
        setNextNextToken(undefined);
      } else if (isNextQuery) {
        incrementQuery();
      }
    }
  }

  /** Call to synchronize the paginator post-request. */
  function syncPaginator({
    nextToken,
    numberOfResourcesReturned,
  }: {
    nextToken: string | undefined;
    numberOfResourcesReturned: number;
  }) {
    numToFillPage.current = numToFillPage.current - numberOfResourcesReturned;

    if (shouldIncrementQuery(nextToken)) {
      incrementQuery();
    }

    if (numToFillPage.current <= 0) {
      numToFillPage.current = pageSize;
    }

    setNextNextToken(nextToken);

    if (unravel) {
      nextPage();
    }
  }

  function incrementQuery() {
    setNextNextToken(undefined);
    setCurrentNextToken(undefined);
    setCurrentQueryIndex((index) => index + 1);
  }

  function shouldIncrementQuery(nextToken?: string) {
    const pageIsNotFull = numToFillPage.current > 0;
    const isNotNextToken = !nextToken;

    return pageIsNotFull && isNotNextToken && isNextQuery;
  }

  function resetNumToFillPage() {
    numToFillPage.current = pageSize;
  }

  return {
    currentQuery,
    hasNextPage,
    nextPage,
    syncPaginator,
    resetNumToFillPage,
  };
}
