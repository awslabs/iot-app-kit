import type { TimeSeriesSummary } from '@aws-sdk/client-iotsitewise';

import type { TimeSeriesExplorerQuery } from './types';
import {
  useInfiniteQueries,
  type QueryFn,
  type QueryFnResponse,
} from '../helpers/use-infinite-queries';
import type { ListTimeSeries } from '../types/data-source';

type UseTimeSeriesQueryFn = QueryFn<
  (params: Parameters<ListTimeSeries>[0]) => QueryFnResponse<TimeSeriesSummary>
>;

/** Use a list of SiteWise TimeSeriesSummary resources. */
export function useTimeSeries({
  listTimeSeries,
  queries,
  pageSize,
}: {
  listTimeSeries: ListTimeSeries;
  queries: TimeSeriesExplorerQuery[];
  pageSize: number;
}) {
  const { resources: timeSeries, ...queryResult } =
    useInfiniteQueries<UseTimeSeriesQueryFn>({
      createQueryKey: ({ maxResults: _maxResults, ...params }) => [
        { resource: 'time series', ...params },
      ],
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
