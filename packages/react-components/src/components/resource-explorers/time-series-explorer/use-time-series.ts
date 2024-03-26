import type { TimeSeriesSummary } from '@aws-sdk/client-iotsitewise';
import { useQuery } from '@tanstack/react-query';

import type { ListTimeSeries } from '../types/data-source';
import { useRef, useState } from 'react';

export interface UseTimeSeriesOptions {
  listTimeSeries: ListTimeSeries;
  queries: {
    timeSeriesType?: Parameters<ListTimeSeries>[0]['timeSeriesType'];
    aliasPrefix?: Parameters<ListTimeSeries>[0]['aliasPrefix'];
    assetId?: Parameters<ListTimeSeries>[0]['assetId'];
  }[];
  pageSize: number;
}

export interface UseTimeSeriesResult {
  timeSeries: TimeSeriesSummary[];
  isLoading: boolean;
  hasNextPage: boolean;
  nextPage: () => void;
}

function usePagination() {
  const [currentQueryIndex, setCurrentQueryIndex] = useState<number>(0);

  // Change next token and trigger re-render.
  const [currentNextToken, setCurrentNextToken] = useState<string | undefined>(
    undefined
  );

  // Store upcoming next token - swap on click next page
  const nextNextTokenRef = useRef<string | undefined>(undefined);

  const hasNextPage = nextNextTokenRef.current != null;

  function nextPage(): void {
    if (hasNextPage) {
      setCurrentNextToken(nextNextTokenRef.current);
      nextNextTokenRef.current = undefined;
    }
  }

  function prepareNextToken(token: string | undefined) {
    nextNextTokenRef.current = token;
  }

  return {
    currentQueryIndex,
    setCurrentQueryIndex,
    currentNextToken,
    prepareNextToken,
    nextPage,
    hasNextPage,
  };
}

export function useTimeSeries({
  listTimeSeries,
  queries,
  pageSize,
}: UseTimeSeriesOptions): UseTimeSeriesResult {
  const [timeSeries, setTimeSeries] = useState<TimeSeriesSummary[]>([]);
  const {
    currentQueryIndex,
    setCurrentQueryIndex,
    currentNextToken,
    nextPage,
    hasNextPage,
    prepareNextToken,
  } = usePagination();
  const currentQuery = queries[currentQueryIndex];
  const resourcesToRequest = useRef<number>(pageSize);

  const { isLoading } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: createQueryKey({
      ...currentQuery,
      nextToken: currentNextToken,
    }),
    queryFn: async () => {
      const response = await listTimeSeries({
        ...currentQuery,
        nextToken: currentNextToken,
        maxResults: resourcesToRequest.current,
      });

      resourcesToRequest.current =
        resourcesToRequest.current -
        (response.TimeSeriesSummaries ?? []).length;

      if (resourcesToRequest.current <= 0) {
        resourcesToRequest.current = pageSize;
      }

      if (resourcesToRequest.current > 0 && response.nextToken == null) {
        if (currentQueryIndex < queries.length - 1) {
          setCurrentQueryIndex((index) => index + 1);
        }
      }

      prepareNextToken(response.nextToken);
      setTimeSeries((ts) => [...ts, ...(response.TimeSeriesSummaries ?? [])]);

      return response;
    },
  });

  return { timeSeries, isLoading, hasNextPage, nextPage };
}

function createQueryKey({
  timeSeriesType,
  aliasPrefix,
  assetId,
  nextToken,
}: {
  timeSeriesType?: Parameters<ListTimeSeries>[0]['timeSeriesType'];
  aliasPrefix?: Parameters<ListTimeSeries>[0]['aliasPrefix'];
  assetId?: Parameters<ListTimeSeries>[0]['assetId'];
  nextToken?: string;
}) {
  return [
    {
      resource: 'Time Series',
      timeSeriesType,
      aliasPrefix,
      assetId,
      nextToken,
    },
  ] as const;
}

/*
function createQueryFn(listTimeSeries: ListTimeSeries) {
  const paginator = new Paginator(listTimeSeries);

  return async function ({
    queryKey: [{ timeSeriesType, aliasPrefix, assetId }],
  }: QueryFunctionContext<ReturnType<typeof createQueryKey>>) {
    const pages = await paginator.paginate({
      timeSeriesType,
      aliasPrefix,
      assetId,
    });
    const timeSeries = pages.flatMap(
      ({ TimeSeriesSummaries = [] }) => TimeSeriesSummaries
    );

    return timeSeries;
  };
}
*/
