import React from 'react';
import { useSelector } from 'react-redux';

import { Table } from '@iot-app-kit/react-components';

import { useDataSource } from '../../hooks/useDataSource';
import { DashboardState } from '~/store/state';
import { TableWidget } from '../types';
import { computeQueryConfigKey } from '../utils/computeQueryConfigKey';

const TableWidgetComponent: React.FC<TableWidget> = (widget) => {
  const viewport = useSelector((state: DashboardState) => state.dashboardConfiguration.viewport);

  const { queryConfig } = widget.properties;

  const { dataSource } = useDataSource();
  const queries = dataSource.query && queryConfig.query ? [dataSource.query?.timeSeriesData(queryConfig.query)] : [];
  const key = computeQueryConfigKey(viewport, widget.properties.queryConfig);

  // Need to map in columns / items
  return <Table key={key} queries={queries} viewport={viewport} columnDefinitions={[]} items={[]} />;
};

export default TableWidgetComponent;
