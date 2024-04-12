import type { TimeSeriesSummary } from '@aws-sdk/client-iotsitewise';

import { useMultipleListRequests } from '../use-multiple-list-requests';
import type { ListTimeSeries } from '../../types/request-fn';
import type {
  UseListAPIBaseOptions,
  UseListAPIBaseResult,
} from '../../types/requests';
import type { PickRequestParameters } from '../../types/request-fn';
import { TIME_SERIES_NAME } from '../../constants/defaults/misc';

export type UseTimeSeriesQuery = PickRequestParameters<
  ListTimeSeries,
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
  return useMultipleListRequests({
    maxResults,
    resourceId: 'TimeSeriesSummary',
    resourceName: TIME_SERIES_NAME,
    paramsList: queries,
    requestFn: listTimeSeries,
    resourceSelector: ({ TimeSeriesSummaries = [] }) => TimeSeriesSummaries,
  });
}
