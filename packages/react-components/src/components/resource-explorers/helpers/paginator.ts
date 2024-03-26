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
}

export function usePagination<T>({
  pageSize,
  queries,
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
  const nextNextTokenRef = useRef<string | undefined>(undefined);

  /** The current query being requested. */
  const currentQuery = {
    ...queries[currentQueryIndex],
    nextToken: currentNextToken,
    maxResults: numToFillPage.current,
  };

  /** Boolean indicating there are more pages to request. */
  const hasNextPage = nextNextTokenRef.current != null;

  /** Call to paginate. */
  function nextPage(): void {
    if (hasNextPage) {
      setCurrentNextToken(nextNextTokenRef.current);
      nextNextTokenRef.current = undefined;
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

    if (numToFillPage.current <= 0) {
      numToFillPage.current = pageSize;
    }

    if (shouldIncrementQuery(nextToken)) {
      nextNextTokenRef.current = undefined;
      setCurrentNextToken(undefined);
      setCurrentQueryIndex((index) => index + 1);
    }

    nextNextTokenRef.current = nextToken;
  }

  function shouldIncrementQuery(nextToken?: string) {
    const pageIsNotFull = numToFillPage.current > 0;
    const isNotNextToken = !nextToken;
    const isNextQuery = currentQueryIndex < queries.length - 1;

    return pageIsNotFull && isNotNextToken && isNextQuery;
  }

  return {
    currentQuery,
    hasNextPage,
    nextPage,
    syncPaginator,
  };
}
