import React from 'react';
import { useSelector } from 'react-redux';

import { Table, TableColumnDefinition } from '@iot-app-kit/react-components';

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
  const dashboardSignificantDigits = useSelector((state: DashboardState) => state.significantDigits);

  const {
    queryConfig,
    columnDefinitions = DEFAULT_TABLE_COLUMN_DEFINITIONS,
    items = [],
    thresholds,
    significantDigits: widgetSignificantDigits,
  } = widget.properties;

  const { iotSiteWiseQuery } = useQueries();
  const queries = iotSiteWiseQuery && queryConfig.query ? [iotSiteWiseQuery?.timeSeriesData(queryConfig.query)] : [];

  const significantDigits = widgetSignificantDigits ?? dashboardSignificantDigits;

  return (
    <Table
      resizableColumns
      queries={queries}
      viewport={viewport}
      columnDefinitions={columnDefinitions}
      items={items}
      thresholds={thresholds}
      significantDigits={significantDigits}
    />
  );
};

export default TableWidgetComponent;
