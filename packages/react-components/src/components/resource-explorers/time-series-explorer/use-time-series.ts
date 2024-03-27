import type { TimeSeriesSummary } from '@aws-sdk/client-iotsitewise';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { usePagination } from '../helpers/paginator';
import type { ListTimeSeries } from '../types/data-source';

const TIME_SERIES_QUERY_KEY = [{ resource: 'time series' }] as const;

export interface UseTimeSeriesOptions {
  listTimeSeries: ListTimeSeries;
  queries: {
    timeSeriesType?: Parameters<ListTimeSeries>[0]['timeSeriesType'];
    aliasPrefix?: Parameters<ListTimeSeries>[0]['aliasPrefix'];
    assetId?: Parameters<ListTimeSeries>[0]['assetId'];
  }[];
  pageSize: number;
}

export function useTimeSeries({
  listTimeSeries,
  queries,
  pageSize,
}: UseTimeSeriesOptions) {
  const queryClient = useQueryClient();
  const { currentQuery, hasNextPage, nextPage, syncPaginator } = usePagination({
    pageSize,
    queries,
  });

  const queryResult = useQuery({
    refetchOnWindowFocus: false,
    enabled: currentQuery != null,
    queryKey: createQueryKey(currentQuery),
    queryFn: async () => {
      const { nextToken, TimeSeriesSummaries: newTimeSeries = [] } =
        await listTimeSeries(currentQuery ?? {});

      syncPaginator({
        nextToken,
        numberOfResourcesReturned: newTimeSeries.length,
      });

      return newTimeSeries;
    },
  });

  const queriesData = queryClient.getQueriesData<TimeSeriesSummary[]>(
    TIME_SERIES_QUERY_KEY
  );
  const timeSeries = queriesData.flatMap(
    ([_, timeSeriesSummaries = []]) => timeSeriesSummaries
  );

  return { ...queryResult, timeSeries, hasNextPage, nextPage };
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
} = {}) {
  return [
    {
      ...TIME_SERIES_QUERY_KEY[0],
      timeSeriesType,
      aliasPrefix,
      assetId,
      nextToken,
    },
  ] as const;
}
