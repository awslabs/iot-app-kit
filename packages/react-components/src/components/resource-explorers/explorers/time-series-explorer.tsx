import type { TimeSeriesSummary } from '@aws-sdk/client-iotsitewise';
import React from 'react';

import {
  useTimeSeries,
  type UseTimeSeriesOptions,
} from '../requests/use-time-series';
import { TimeSeriesTable } from '../tables/time-series-table';
import type { ResourceExplorerProps } from '../types/resource-explorer';
import type { TimeSeriesName } from '../types/resource';
import type { ListTimeSeries } from '../types/request-fn';
import { useUserSettings } from '../use-settings';
import { TIME_SERIES_NAME } from '../constants/defaults/misc';
import { DEFAULT_PAGE_SIZE } from '../../table/constants';
import { DEFAULT_TIME_SERIES_TABLE_PROPERTIES } from '../constants/defaults/table-properties';
import { createDefaultTableUserSettings } from '../constants/defaults/misc';

export interface TimeSeriesExplorerProps
  extends ResourceExplorerProps<TimeSeriesSummary, TimeSeriesName> {
  /** List of parameters for requesting time series summary resources. */
  queries: UseTimeSeriesOptions['queries'];

  dataSource: {
    listTimeSeries: ListTimeSeries;
  };
}

/**
 * Explore and select IoT SiteWise time series summary resources.
 *
 * @experimental Do not use in production.
 */
export function TimeSeriesExplorer({
  dataSource,
  queries,
  shouldStoreUserSettings,
  defaultPageSize: userCustomDefaultPageSize,
  defaultTableUserSettings: userCustomTableUserSettings,
  ...timeSeriesExplorerProps
}: TimeSeriesExplorerProps) {
  const defaultPageSize = userCustomDefaultPageSize ?? DEFAULT_PAGE_SIZE;
  const defaultTableUserSettings =
    userCustomTableUserSettings ??
    createDefaultTableUserSettings(DEFAULT_TIME_SERIES_TABLE_PROPERTIES);

  const [userSettings, onUserSettingsChange] =
    useUserSettings<TimeSeriesSummary>({
      resourceName: TIME_SERIES_NAME,
      defaultPageSize,
      defaultTableUserSettings,
      shouldStoreUserSettings,
    });

  const { nextPage: onClickNextPage, ...timeSeriesResult } = useTimeSeries({
    listTimeSeries: dataSource.listTimeSeries,
    queries,
    maxResults: userSettings.pageSize,
  });

  return (
    <TimeSeriesTable
      {...timeSeriesExplorerProps}
      {...timeSeriesResult}
      userSettings={userSettings}
      onUserSettingsChange={onUserSettingsChange}
      onClickNextPage={onClickNextPage}
    />
  );
}
