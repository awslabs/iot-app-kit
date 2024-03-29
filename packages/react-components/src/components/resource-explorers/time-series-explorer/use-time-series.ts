import type { TimeSeriesSummary } from '@aws-sdk/client-iotsitewise';

import type { TimeSeriesExplorerQuery } from './types';
import { useInfiniteQueries } from '../helpers/use-infinite-queries';
import type { ListTimeSeries } from '../types/data-source';

export function useTimeSeries({
  listTimeSeries,
  queries,
  pageSize,
}: {
  listTimeSeries: ListTimeSeries;
  queries: TimeSeriesExplorerQuery[];
  pageSize: number;
}) {
  const { resources: timeSeries, ...queryResult } = useInfiniteQueries<
    (
      params: Parameters<ListTimeSeries>[0]
    ) => Promise<{ nextToken?: string; resources: TimeSeriesSummary[] }>
  >({
    createQueryKey: ({ maxResults: _maxResults, ...params }) => [
      { resource: 'time series', ...params },
    ],
    queryFn: async (params) => {
      console.log(params);
      const { nextToken, TimeSeriesSummaries: resources = [] } =
        await listTimeSeries(params);

      return { nextToken, resources };
    },
    queries,
    pageSize,
  });

  return { timeSeries, ...queryResult };
}
