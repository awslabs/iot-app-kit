import type { TimeSeriesSummary } from '@aws-sdk/client-iotsitewise';
import React from 'react';

import { useTimeSeries } from './use-time-series';
import { ResourceTable } from '../resource-table/resource-table';
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
}: TimeSeriesExplorerProps) {
  const { timeSeries, isLoading, hasNextPage, nextPage } = useTimeSeries({
    listTimeSeries: dataSource.listTimeSeries,
    queries,
    pageSize: 10,
  });

  return (
    <ResourceTable
      pageSize={10}
      hasNextPage={hasNextPage}
      trackBy={({ timeSeriesId }) => timeSeriesId}
      onNextPageClick={nextPage}
      isLoading={isLoading}
      resources={timeSeries}
      filterEnabled={filterEnabled}
      schema={{
        name: 'Time series',
        pluralName: 'Time series',
        properties: [
          {
            id: 'alias',
            name: 'Alias',
            pluralName: 'Aliases',
            render: ({ alias }) => alias,
            filterOperators: ['!:'],
          },
          {
            id: 'assetId',
            name: 'Asset ID',
            pluralName: 'Asset IDs',
            render: ({ assetId }) => assetId,
          },
          {
            id: 'dataType',
            name: 'Data type',
            pluralName: 'Data types',
            render: ({ dataType }) => dataType,
          },
          {
            id: 'dataTypeSpec',
            name: 'Data type spec',
            pluralName: 'Data type specs',
            render: ({ dataTypeSpec }) => dataTypeSpec,
          },
          {
            id: 'propertyId',
            name: 'Property ID',
            pluralName: 'Property IDs',
            render: ({ propertyId }) => propertyId,
          },
          {
            id: 'timeSeriesArn',
            name: 'ARN',
            pluralName: 'ARNs',
            render: ({ timeSeriesArn }) => timeSeriesArn,
          },
          {
            id: 'timeSeriesCreationDate',
            name: 'Creation date',
            pluralName: 'Creation dates',
            render: ({ timeSeriesCreationDate }) =>
              timeSeriesCreationDate?.toLocaleDateString(),
          },
          {
            id: 'timeSeriesId',
            name: 'ID',
            pluralName: 'IDs',
            render: ({ timeSeriesId }) => timeSeriesId,
          },
          {
            id: 'timeSeriesLastUpdateDate',
            name: 'Last update date',
            pluralName: 'Last update dates',
            render: ({ timeSeriesLastUpdateDate }) =>
              timeSeriesLastUpdateDate?.toLocaleDateString(),
          },
        ],
      }}
    />
  );
}
