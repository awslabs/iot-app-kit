import type { TimeSeriesSummary } from '@aws-sdk/client-iotsitewise';
import React from 'react';

import { TIME_SERIES_EXPLORER_SCHEMA } from './constants';
import {
  useTimeSeries,
  type UseTimeSeriesOptions,
} from '../queries/use-time-series';
import { ResourceTable } from '../resource-table/resource-table';
import { useResourceTablePreferences } from '../resource-table/use-resource-table-preferences';
import type { ListTimeSeries } from '../types/data-source';
import type { ResourceExplorerProps } from '../types/resource-explorer';

export interface TimeSeriesExplorerProps
  extends ResourceExplorerProps<TimeSeriesSummary> {
  dataSource: TimeSeriesExplorerDataSource;
  queries: UseTimeSeriesOptions['queries'];
}

interface TimeSeriesExplorerDataSource {
  listTimeSeries: ListTimeSeries;
}

/**
 * Explore AWS IoT SiteWise time series.
 *
 * @experimental
 *
 * Do not use in production.
 */
export function TimeSeriesExplorer({
  dataSource,
  queries,
  filterEnabled,
  preferencesEnabled,
}: TimeSeriesExplorerProps) {
  const [preferences, setPreferences] = useResourceTablePreferences({
    schema: TIME_SERIES_EXPLORER_SCHEMA,
  });

  const { timeSeries, isLoading, hasNextPage, fetchNextPage, error } =
    useTimeSeries({
      listTimeSeries: dataSource.listTimeSeries,
      queries,
      pageSize: preferences.pageSize,
    });

  return (
    <ResourceTable
      error={error}
      preferences={preferences}
      setPreferences={setPreferences}
      preferencesEnabled={preferencesEnabled}
      hasNextPage={hasNextPage}
      trackBy={({ timeSeriesId }) => timeSeriesId}
      onNextPageClick={fetchNextPage}
      isLoading={isLoading}
      resources={timeSeries}
      filterEnabled={filterEnabled}
      schema={TIME_SERIES_EXPLORER_SCHEMA}
    />
  );
}
