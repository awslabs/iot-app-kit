import type { TimeSeriesSummary } from '@aws-sdk/client-iotsitewise';
import {
  useInfiniteQueries,
  type UseInfiniteQueriesResult,
} from '../helpers/use-infinite-queries';
import type { ListTimeSeries } from '../types/data-source';

export type UseTimeSeriesQuery = Pick<
  Parameters<ListTimeSeries>[0],
  'aliasPrefix' | 'assetId' | 'timeSeriesType'
>;

export interface UseTimeSeriesOptions {
  queries: UseTimeSeriesQuery[];
  pageSize: number;
  listTimeSeries: ListTimeSeries;
}

export interface UseTimeSeriesResult
  extends Omit<UseInfiniteQueriesResult, 'resources'> {
  timeSeries: TimeSeriesSummary[];
}

/** Use a list of SiteWise TimeSeriesSummary resources. */
export function useTimeSeries({
  queries,
  pageSize,
  listTimeSeries,
}: UseTimeSeriesOptions): UseTimeSeriesResult {
  const { resources: timeSeries, ...queryResult } = useInfiniteQueries({
    createQueryKey: (query) => [{ resource: 'time series', ...query }],
    queryFn: async (params) => {
      const { nextToken, TimeSeriesSummaries: resources = [] } =
        await listTimeSeries(params);

      return { nextToken, resources };
    },
    queries,
    pageSize,
  });

  return { timeSeries, ...queryResult };
}
