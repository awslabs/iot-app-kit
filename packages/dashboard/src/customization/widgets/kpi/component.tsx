import React from 'react';
import { useSelector } from 'react-redux';

import { Annotations, YAnnotation } from '@iot-app-kit/core';
import { Kpi } from '@iot-app-kit/react-components';

import { useDataSource } from '../../hooks/useDataSource';
import { DashboardState } from '~/store/state';
import { KPIWidget } from '../types';
import { computeQueryConfigKey } from '../utils/computeQueryConfigKey';

const KPIWidgetComponent: React.FC<KPIWidget> = (widget) => {
  const viewport = useSelector((state: DashboardState) => state.dashboardConfiguration.viewport);

  const { queryConfig, styleSettings, thresholdSettings } = widget.properties;

  const { dataSource } = useDataSource();
  const queries = dataSource.query && queryConfig.query ? [dataSource.query?.timeSeriesData(queryConfig.query)] : [];
  const key = computeQueryConfigKey(viewport, queryConfig);

  const annotations: Annotations = {
    y: thresholdSettings?.thresholds?.map(
      (t) =>
        ({
          id: t.id,
          comparisonOperator: t.comparisonOperator,
          color: t.color,
          value: t.comparisonValue,
        } as YAnnotation)
    ),
    colorDataAcrossThresholds: thresholdSettings?.colorAcrossThresholds,
  };

  return (
    <Kpi key={key} queries={queries} viewport={viewport} styleSettings={styleSettings} annotations={annotations} />
  );
};

export default KPIWidgetComponent;
