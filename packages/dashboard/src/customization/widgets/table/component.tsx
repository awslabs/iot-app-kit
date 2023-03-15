import React from 'react';
import { useSelector } from 'react-redux';

import { Table } from '@iot-app-kit/react-components';

import { useDataSource } from '../../hooks/useDataSource';
import { computeQueryConfigKey } from '../utils/computeQueryConfigKey';
import { DEFAULT_TABLE_COLUMN_DEFINITIONS } from '~/customization/widgets';
import type { DashboardState } from '~/store/state';
import type { TableWidget } from '../types';

const TableWidgetComponent: React.FC<TableWidget> = (widget) => {
  const viewport = useSelector((state: DashboardState) => state.dashboardConfiguration.viewport);

  const { queryConfig, columnDefinitions = DEFAULT_TABLE_COLUMN_DEFINITIONS, items = [] } = widget.properties;

  const { dataSource } = useDataSource();
  const queries = dataSource.query && queryConfig.query ? [dataSource.query?.timeSeriesData(queryConfig.query)] : [];
  const key = computeQueryConfigKey(viewport, widget.properties.queryConfig);

  return (
    <Table
      resizableColumns
      key={key}
      queries={queries}
      viewport={viewport}
      columnDefinitions={columnDefinitions}
      items={items}
    />
  );
};

export default TableWidgetComponent;
