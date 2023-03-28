import React from 'react';
import { useSelector } from 'react-redux';

import { ScatterChart } from '@iot-app-kit/react-components';
import { Axis } from '@iot-app-kit/charts-core';

import { computeQueryConfigKey } from '../utils/computeQueryConfigKey';
import type { DashboardState } from '~/store/state';
import type { ScatterChartWidget } from '../types';
import { useQueries } from '~/components/dashboard/queryContext';

const ScatterChartWidgetComponent: React.FC<ScatterChartWidget> = (widget) => {
  const viewport = useSelector((state: DashboardState) => state.dashboardConfiguration.viewport);
  const readOnly = useSelector((state: DashboardState) => state.readOnly);

  const { queryConfig, styleSettings, axis, thresholds, annotations } = widget.properties;

  const { iotSiteWiseQuery } = useQueries();
  const queries = iotSiteWiseQuery && queryConfig.query ? [iotSiteWiseQuery?.timeSeriesData(queryConfig.query)] : [];
  const key = computeQueryConfigKey(viewport, queryConfig);

  const { showX, showY, yAxisLabel } = axis || {};
  const axisOptions: Axis.Options = {
    showX,
    showY,
    labels: { yAxis: { content: yAxisLabel || '' } },
  };
  return (
    <ScatterChart
      key={key}
      queries={queries}
      viewport={viewport}
      gestures={readOnly}
      axis={axisOptions}
      styles={styleSettings}
      annotations={annotations}
      thresholds={thresholds}
    />
  );
};

export default ScatterChartWidgetComponent;
