import type { TimeSeriesSummary } from '@aws-sdk/client-iotsitewise';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { usePagination } from '../helpers/paginator';
import type { ListTimeSeries } from '../types/data-source';

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
  const [timeSeries, setTimeSeries] = useState<TimeSeriesSummary[]>([]);
  const { currentQuery, hasNextPage, nextPage, syncPaginator } = usePagination({
    pageSize,
    queries,
  });

  const queryResult = useQuery({
    refetchOnWindowFocus: false,
    queryKey: createQueryKey(currentQuery),
    queryFn: async () => {
      const { nextToken, TimeSeriesSummaries: newTimeSeries = [] } =
        await listTimeSeries(currentQuery);

      syncPaginator({
        nextToken,
        numberOfResourcesReturned: newTimeSeries.length,
      });

      // Update state of time series directly
      setTimeSeries((ts) => [...ts, ...newTimeSeries]);
    },
  });

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
