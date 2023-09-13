import React from 'react';
import { useSelector } from 'react-redux';

import { BarChart } from '@iot-app-kit/react-components';

import { computeQueryConfigKey } from '../utils/computeQueryConfigKey';
import type { DashboardState } from '~/store/state';
import type { BarChartWidget } from '.././types';
import { useQueries } from '~/components/dashboard/queryContext';
import { getAggregation } from '../utils/widgetAggregationUtils';
import { aggregateToString } from '~/customization/propertiesSections/aggregationSettings/helpers';
import { useChartSize } from '~/hooks/useChartSize';
import WidgetTile from '~/components/widgets/tile';

const BarChartWidgetComponent: React.FC<BarChartWidget> = (widget) => {
  const viewport = useSelector((state: DashboardState) => state.dashboardConfiguration.viewport);
  const readOnly = useSelector((state: DashboardState) => state.readOnly);
  const dashboardSignificantDigits = useSelector((state: DashboardState) => state.significantDigits);
  const chartSize = useChartSize(widget);

  const {
    queryConfig,
    styleSettings,
    axis,
    thresholdSettings,
    thresholds,
    significantDigits: widgetSignificantDigits,
  } = widget.properties;

  const { iotSiteWiseQuery } = useQueries();
  const queries = iotSiteWiseQuery && queryConfig.query ? [iotSiteWiseQuery?.timeSeriesData(queryConfig.query)] : [];
  const key = computeQueryConfigKey(viewport, queryConfig);
  const aggregation = getAggregation(queryConfig);
  const significantDigits = widgetSignificantDigits ?? dashboardSignificantDigits;
  // there may be better ways to fix this, i.e. not have -44 and let the chart container  take its parent height,
  // the problem is that the Resizable component needs a "height" to be provided,
  // so not entirely sure if we can have a mechanism where the container auto adjusts the height
  // the 44 is from the widget tile header's height
  const size = { width: chartSize.width, height: chartSize.height - 44 };
  return (
    <WidgetTile widget={widget} removeable title='Bar Chart'>
      <BarChart
        chartSize={size}
        key={key}
        queries={queries}
        viewport={viewport}
        gestures={readOnly}
        aggregationType={aggregateToString(aggregation)}
        axis={axis}
        styles={styleSettings}
        thresholds={thresholds}
        thresholdSettings={thresholdSettings}
        significantDigits={significantDigits}
      />
    </WidgetTile>
  );
};

export default BarChartWidgetComponent;
