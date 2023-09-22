import React from 'react';
import { useSelector } from 'react-redux';

import { LineChart } from '@iot-app-kit/react-components';
import { SiteWiseAssetQuery } from '@iot-app-kit/source-iotsitewise';

import { computeQueryConfigKey } from '../utils/computeQueryConfigKey';
import type { DashboardState } from '~/store/state';
import type { LineChartWidget } from '../types';
import { useQueries } from '~/components/dashboard/queryContext';
import { getAggregation } from '../utils/widgetAggregationUtils';
import { aggregateToString } from '~/customization/propertiesSections/aggregationSettings/helpers';
import { useChartSize } from '~/hooks/useChartSize';
import WidgetTile from '~/components/widgets/tile';

const LineChartWidgetComponent: React.FC<LineChartWidget> = (widget) => {
  const viewport = useSelector((state: DashboardState) => state.dashboardConfiguration.viewport);
  const readOnly = useSelector((state: DashboardState) => state.readOnly);
  const chartSize = useChartSize(widget);
  const dashboardSignificantDigits = useSelector((state: DashboardState) => state.significantDigits);

  const {
    queryConfig,
    styleSettings,
    axis,
    thresholds,
    thresholdSettings,
    significantDigits: widgetSignificantDigits,
  } = widget.properties;

  const { iotSiteWiseQuery } = useQueries();
  const queries =
    iotSiteWiseQuery && queryConfig.query
      ? [iotSiteWiseQuery?.timeSeriesData(queryConfig.query as SiteWiseAssetQuery)]
      : [];
  const key = computeQueryConfigKey(viewport, queryConfig);
  const aggregation = getAggregation(widget);

  const significantDigits = widgetSignificantDigits ?? dashboardSignificantDigits;

  return (
    <WidgetTile widget={widget} removeable>
      <LineChart
        chartSize={chartSize}
        key={key}
        queries={queries}
        viewport={viewport}
        gestures={readOnly}
        axis={axis}
        aggregationType={aggregateToString(aggregation)}
        styles={styleSettings}
        thresholds={thresholds}
        thresholdSettings={thresholdSettings}
        significantDigits={significantDigits}
      />
    </WidgetTile>
  );
};

export default LineChartWidgetComponent;
