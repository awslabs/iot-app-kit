import type { ListTimeSeries } from '../types/data-source';
import type { First } from '../types/helpers';

type ListTimeSeriesParams = First<Parameters<ListTimeSeries>>;

export type TimeSeriesExplorerQuery = Pick<
  ListTimeSeriesParams,
  'timeSeriesType' | 'aliasPrefix' | 'assetId'
>;
