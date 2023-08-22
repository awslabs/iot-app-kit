import React from 'react';
import { useSelector } from 'react-redux';

import { Chart, getConfigValue, ScatterChart } from '@iot-app-kit/react-components';

import { computeQueryConfigKey } from '../utils/computeQueryConfigKey';
import type { DashboardState } from '~/store/state';
import type { ScatterChartWidget } from '../types';
import { useQueries } from '~/components/dashboard/queryContext';
import { getAggregation } from '../utils/widgetAggregationUtils';
import { aggregateToString } from '~/customization/propertiesSections/aggregationSettings/helpers';
import { useChartSize } from '~/hooks/useChartSize';

const ScatterChartWidgetComponent: React.FC<ScatterChartWidget> = (widget) => {
  const viewport = useSelector((state: DashboardState) => state.dashboardConfiguration.viewport);
  const readOnly = useSelector((state: DashboardState) => state.readOnly);
  const dashboardSignificantDigits = useSelector((state: DashboardState) => state.significantDigits);
  const chartSize = useChartSize(widget);
  const showEcharts = getConfigValue('useEcharts');
  const {
    queryConfig,
    styleSettings,
    axis,
    thresholds,
    thresholdSettings,
    significantDigits: widgetSignificantDigits,
  } = widget.properties;

  const { iotSiteWiseQuery } = useQueries();
  const queries = iotSiteWiseQuery && queryConfig.query ? [iotSiteWiseQuery?.timeSeriesData(queryConfig.query)] : [];
  const key = computeQueryConfigKey(viewport, queryConfig);
  const aggregation = getAggregation(queryConfig);

  const significantDigits = widgetSignificantDigits ?? dashboardSignificantDigits;
  const grid = useSelector((state: DashboardState) => state.grid);
  const size = { width: grid.cellSize * widget.width, height: grid.cellSize * widget.height };

  if (showEcharts) {
    return (
      <Chart
        defaultVisualizationType='bar'
        key={key}
        queries={queries}
        viewport={viewport}
        gestures={readOnly}
        axis={axis}
        aggregationType={aggregateToString(aggregation)}
        styleSettings={styleSettings}
        thresholds={thresholds}
        thresholdSettings={thresholdSettings}
        significantDigits={significantDigits}
        size={size}
      />
    );
  }
  return (
    <ScatterChart
      chartSize={chartSize}
      key={key}
      queries={queries}
      viewport={viewport}
      gestures={readOnly}
      axis={axis}
      styles={styleSettings}
      thresholdSettings={thresholdSettings}
      aggregationType={aggregateToString(aggregation)}
      thresholds={thresholds}
      significantDigits={significantDigits}
    />
  );
};

export default ScatterChartWidgetComponent;
