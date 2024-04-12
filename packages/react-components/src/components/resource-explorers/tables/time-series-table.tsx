import type { TimeSeriesSummary } from '@aws-sdk/client-iotsitewise';
import React from 'react';

import { ResourceTable } from './resource-table';
import type { ConcreteResourceTableProps } from './types';
import type { TimeSeriesName } from '../types/resource';
import { DEFAULT_TIME_SERIES_TABLE_PROPERTIES } from '../constants/defaults/table-properties';

export type TimeSeriesTableProps = ConcreteResourceTableProps<
  TimeSeriesSummary,
  TimeSeriesName
>;

/**
 * Table UI component for exploring and selecting IoT SiteWise time series
 * summary resources.
 */
export function TimeSeriesTable({
  timeSeries,
  onSelectTimeSeries,
  selectedTimeSeries,
  isTimeSeriesDisabled,
  ...tableProperties
}: TimeSeriesTableProps) {
  return (
    <ResourceTable<TimeSeriesSummary>
      {...tableProperties}
      resourceName='Time series'
      pluralResourceName='Time series'
      properties={DEFAULT_TIME_SERIES_TABLE_PROPERTIES}
      resourceKey={({ timeSeriesId = '' }) => timeSeriesId}
      resources={timeSeries}
      selectedResources={selectedTimeSeries}
      onSelectResource={onSelectTimeSeries}
      isResourceDisabled={isTimeSeriesDisabled}
    />
  );
}
