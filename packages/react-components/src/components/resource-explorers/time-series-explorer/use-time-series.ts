import type { TimeSeriesSummary } from '@aws-sdk/client-iotsitewise';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import type { TimeSeriesExplorerQuery } from './types';
import { usePagination } from '../helpers/paginator';
import { createBaseQueryKey, handleQueryError } from '../helpers/queries';
import type { ListTimeSeries } from '../types/data-source';
import { Paginated } from '../types/queries';

const TIME_SERIES_BASE_QUERY_KEY = createBaseQueryKey('time series');

export interface UseTimeSeriesOptions {
  listTimeSeries: ListTimeSeries;
  queries: TimeSeriesExplorerQuery[];
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
      try {
        const { nextToken, TimeSeriesSummaries: newTimeSeries = [] } =
          await listTimeSeries(currentQuery ?? {});

        syncPaginator({
          nextToken,
          numberOfResourcesReturned: newTimeSeries.length,
        });

        return newTimeSeries;
      } catch (error) {
        handleQueryError('time series', error);
      }
    },
  });

  const queriesData = queryClient.getQueriesData<TimeSeriesSummary[]>(
    TIME_SERIES_BASE_QUERY_KEY
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
}: Paginated<TimeSeriesExplorerQuery> = {}) {
  return [
    {
      ...TIME_SERIES_BASE_QUERY_KEY[0],
      timeSeriesType,
      aliasPrefix,
      assetId,
      nextToken,
    },
  ] as const;
}
