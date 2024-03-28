import type { TimeSeriesSummary } from '@aws-sdk/client-iotsitewise';
import React from 'react';

import { TIME_SERIES_EXPLORER_SCHEMA } from './constants';
import { useTimeSeries } from './use-time-series';
import { ResourceTable } from '../resource-table/resource-table';
import { useResourceTablePreferences } from '../resource-table/use-resource-table-preferences';
import type { ListTimeSeries } from '../types/data-source';
import type { ResourceExplorerProps } from '../types/resource-explorer';
import type { TimeSeriesExplorerQuery } from './types';

export interface TimeSeriesExplorerProps
  extends ResourceExplorerProps<TimeSeriesSummary> {
  dataSource: {
    listTimeSeries: ListTimeSeries;
  };

  queries: TimeSeriesExplorerQuery[];
}

/**
 * Explore AWS IoT SiteWise time series.
 *
 * @experimental
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

  const { timeSeries, isLoading, hasNextPage, nextPage, error } = useTimeSeries(
    {
      listTimeSeries: dataSource.listTimeSeries,
      queries,
      pageSize: preferences.pageSize ?? 10,
    }
  );

  return (
    <ResourceTable
      error={error}
      preferences={preferences}
      setPreferences={setPreferences}
      preferencesEnabled={preferencesEnabled}
      hasNextPage={hasNextPage}
      trackBy={({ timeSeriesId }) => timeSeriesId}
      onNextPageClick={nextPage}
      isLoading={isLoading}
      resources={timeSeries}
      filterEnabled={filterEnabled}
      schema={TIME_SERIES_EXPLORER_SCHEMA}
    />
  );
}
