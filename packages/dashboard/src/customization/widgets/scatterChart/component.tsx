import React from 'react';
import { useSelector } from 'react-redux';

import { ScatterChart } from '@iot-app-kit/react-components';
import { Annotations, Axis, YAnnotation } from '@synchro-charts/core';

import { useDataSource } from '../../hooks/useDataSource';
import { DashboardState } from '~/store/state';
import { ScatterChartWidget } from '../types';
import { computeQueryConfigKey } from '../utils/computeQueryConfigKey';

const ScatterChartWidgetComponent: React.FC<ScatterChartWidget> = (widget) => {
  const viewport = useSelector((state: DashboardState) => state.dashboardConfiguration.viewport);
  const readOnly = useSelector((state: DashboardState) => state.readOnly);

  const { queryConfig, styleSettings, axis, thresholdSettings } = widget.properties;

  const { dataSource } = useDataSource();
  const queries = dataSource.query && queryConfig.query ? [dataSource.query?.timeSeriesData(queryConfig.query)] : [];
  const key = computeQueryConfigKey(viewport, queryConfig);

  const { showX, showY, yAxisLabel } = axis || {};
  const axisOptions: Axis.Options = {
    showX,
    showY,
    labels: { yAxis: { content: yAxisLabel || '' } },
  };
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
    <ScatterChart
      key={key}
      queries={queries}
      viewport={viewport}
      gestures={readOnly}
      axis={axisOptions}
      styleSettings={styleSettings}
      annotations={annotations}
    />
  );
};

export default ScatterChartWidgetComponent;
