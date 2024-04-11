import type { TimeSeriesSummary } from '@aws-sdk/client-iotsitewise';

import { useTwoDimensionalListResources } from '../helpers/use-two-dimensional-list-resources';
import type { ListTimeSeries } from '../../types/data-source';
import type { UseListAPIBaseOptions, UseListAPIBaseResult } from '../types';

export type UseTimeSeriesQuery = Pick<
  Parameters<ListTimeSeries>[0],
  'aliasPrefix' | 'assetId' | 'timeSeriesType'
>;

export interface UseTimeSeriesOptions extends UseListAPIBaseOptions {
  queries: UseTimeSeriesQuery[];
  listTimeSeries: ListTimeSeries;
}

export interface UseTimeSeriesResult extends UseListAPIBaseResult {
  timeSeries: TimeSeriesSummary[];
}

/**
 * Use a list of IoT SiteWise TimeSeriesSummary resources.
 *
 * @see {@link https://docs.aws.amazon.com/iot-sitewise/latest/APIReference/API_TimeSeriesSummary.html}
 *
 * @experimental Do not use in production.
 */
export function useTimeSeries({
  queries,
  maxResults,
  listTimeSeries,
}: UseTimeSeriesOptions): UseTimeSeriesResult {
  const { resources: timeSeries, ...responseResult } =
    useTwoDimensionalListResources({
      maxResults,
      resourceName: 'TimeSeriesSummary',
      requests: queries,
      requestFn: listTimeSeries,
      resourceSelector: ({ TimeSeriesSummaries = [] }) => TimeSeriesSummaries,
    });

  return { timeSeries, ...responseResult };
}
