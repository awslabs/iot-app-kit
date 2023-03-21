import React from 'react';
import { useSelector } from 'react-redux';

import { Table, TableColumnDefinition } from '@iot-app-kit/react-components';

import { computeQueryConfigKey } from '../utils/computeQueryConfigKey';

import type { DashboardState } from '~/store/state';
import type { TableWidget } from '../types';
import { useQueries } from '~/components/dashboard/queryContext';

export const DEFAULT_TABLE_COLUMN_DEFINITIONS: TableColumnDefinition[] = [
  {
    key: 'property',
    header: 'Property',
    sortingField: 'property',
  },
  {
    key: 'value',
    header: 'Latest value',
    sortingField: 'value',
  },
  {
    key: 'unit',
    header: 'Unit',
    sortingField: 'unit',
  },
];

const TableWidgetComponent: React.FC<TableWidget> = (widget) => {
  const viewport = useSelector((state: DashboardState) => state.dashboardConfiguration.viewport);

  const {
    queryConfig,
    columnDefinitions = DEFAULT_TABLE_COLUMN_DEFINITIONS,
    items = [],
    thresholds,
  } = widget.properties;

  const { iotSiteWiseQuery } = useQueries();
  const queries = iotSiteWiseQuery && queryConfig.query ? [iotSiteWiseQuery?.timeSeriesData(queryConfig.query)] : [];
  const key = computeQueryConfigKey(viewport, widget.properties.queryConfig);

  return (
    <Table
      resizableColumns
      key={key}
      queries={queries}
      viewport={viewport}
      columnDefinitions={columnDefinitions}
      items={items}
      thresholds={thresholds}
    />
  );
};

export default TableWidgetComponent;
