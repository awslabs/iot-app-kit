import React from 'react';
import { TableBase } from './tableBase';
import { useTimeSeriesData } from '../../hooks/useTimeSeriesData';
import { useViewport } from '../../hooks/useViewport';
import type { StyleSettingsMap, Threshold, TimeSeriesDataQuery, Viewport } from '@iot-app-kit/core';
import { UseCollectionOptions } from '@cloudscape-design/collection-hooks';
import { TableColumnDefinition, TableItem, TableItemHydrated } from './types';
import { createTableItems } from './createTableItems';
import { DEFAULT_TABLE_MESSAGES } from './messages';
import { TableProps as TableBaseProps } from '@cloudscape-design/components';

const DEFAULT_VIEWPORT: Viewport = { duration: '10m' };

export const Table = ({
  queries,
  viewport: passedInViewport,
  thresholds,
  columnDefinitions,
  propertyFiltering,
  items,
  sorting,
  styles,
  ...props
}: {
  columnDefinitions: TableColumnDefinition[];
  queries: TimeSeriesDataQuery[];
  items: TableItem[];
  thresholds?: Threshold[];
  sorting?: UseCollectionOptions<TableItemHydrated>['sorting'];
  propertyFiltering?: UseCollectionOptions<TableItemHydrated>['propertyFiltering'];
  viewport?: Viewport;
  styles?: StyleSettingsMap;
} & Pick<TableBaseProps, 'resizableColumns'>) => {
  const { dataStreams } = useTimeSeriesData({
    viewport: passedInViewport,
    queries,
    settings: { fetchMostRecentBeforeEnd: true },
    styles,
  });
  const { viewport } = useViewport();

  const utilizedViewport = passedInViewport || viewport || DEFAULT_VIEWPORT; // explicitly passed in viewport overrides viewport group
  const itemsWithData = createTableItems(
    {
      dataStreams,
      items,
      viewport: utilizedViewport,
      thresholds,
    },
    DEFAULT_TABLE_MESSAGES
  );

  return (
    <TableBase
      {...props}
      items={itemsWithData}
      sorting={sorting}
      columnDefinitions={columnDefinitions}
      propertyFiltering={propertyFiltering}
      messageOverrides={DEFAULT_TABLE_MESSAGES}
    />
  );
};
