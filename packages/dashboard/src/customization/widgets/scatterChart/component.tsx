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
import WidgetTile from '~/components/widgets/tile';

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
  const aggregation = getAggregation(widget);

  const significantDigits = widgetSignificantDigits ?? dashboardSignificantDigits;
  // there may be better ways to fix this, i.e. not have -44 and let the chart container  take its parent height,
  // the problem is that the Resizable component needs a "height" to be provided,
  // so not entirely sure if we can have a mechanism where the container auto adjusts the height
  // the 44 is from the widget tile header's height
  const size = { width: chartSize.width, height: chartSize.height - 44 };

  if (showEcharts) {
    return (
      <WidgetTile widget={widget} removeable title='Scatter Chart'>
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
      </WidgetTile>
    );
  }
  return (
    <WidgetTile widget={widget} removeable>
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
    </WidgetTile>
  );
};

export default ScatterChartWidgetComponent;
