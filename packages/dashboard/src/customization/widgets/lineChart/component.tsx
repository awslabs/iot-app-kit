import React from 'react';
import { useSelector } from 'react-redux';

import { LineChart } from '@iot-app-kit/react-components';
import { Annotations, YAnnotation } from '@iot-app-kit/core';
import { Axis } from '@iot-app-kit-visualizations/core';

import { useDataSource } from '../../hooks/useDataSource';
import { DashboardState } from '~/store/state';
import { LineChartWidget } from '../types';
import { computeQueryConfigKey } from '../utils/computeQueryConfigKey';

const LineChartWidgetComponent: React.FC<LineChartWidget> = (widget) => {
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
    <LineChart
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

export default LineChartWidgetComponent;
