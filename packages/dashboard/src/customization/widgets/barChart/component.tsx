import React from 'react';
import { useSelector } from 'react-redux';

import { BarChart } from '@iot-app-kit/react-components';

import type { DashboardState } from '~/store/state';
import type { BarChartWidget } from '.././types';
import { useQueries } from '~/components/dashboard/queryContext';
import { getAggregation } from '../utils/widgetAggregationUtils';
import { aggregateToString } from '~/customization/propertiesSections/aggregationSettings/helpers';

const BarChartWidgetComponent: React.FC<BarChartWidget> = (widget) => {
  const viewport = useSelector((state: DashboardState) => state.dashboardConfiguration.viewport);
  const readOnly = useSelector((state: DashboardState) => state.readOnly);
  const dashboardSignificantDigits = useSelector((state: DashboardState) => state.significantDigits);

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
  const aggregation = getAggregation(queryConfig);

  const significantDigits = widgetSignificantDigits ?? dashboardSignificantDigits;

  return (
    <BarChart
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
  );
};

export default BarChartWidgetComponent;
