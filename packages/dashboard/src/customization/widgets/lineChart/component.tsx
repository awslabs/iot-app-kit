import React from 'react';
import { useSelector } from 'react-redux';

import { LineChart } from '@iot-app-kit/react-components';

import { computeQueryConfigKey } from '../utils/computeQueryConfigKey';
import type { DashboardState } from '~/store/state';
import type { LineChartWidget } from '../types';
import { useQueries } from '~/components/dashboard/queryContext';

const LineChartWidgetComponent: React.FC<LineChartWidget> = (widget) => {
  const viewport = useSelector((state: DashboardState) => state.dashboardConfiguration.viewport);
  const readOnly = useSelector((state: DashboardState) => state.readOnly);

  const { queryConfig, styleSettings, axis, thresholds, thresholdSettings } = widget.properties;

  const { iotSiteWiseQuery } = useQueries();
  const queries = iotSiteWiseQuery && queryConfig.query ? [iotSiteWiseQuery?.timeSeriesData(queryConfig.query)] : [];
  const key = computeQueryConfigKey(viewport, queryConfig);

  return (
    <LineChart
      key={key}
      queries={queries}
      viewport={viewport}
      gestures={readOnly}
      axis={axis}
      styles={styleSettings}
      thresholds={thresholds}
      thresholdSettings={thresholdSettings}
    />
  );
};

export default LineChartWidgetComponent;
