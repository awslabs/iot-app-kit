import { BarChart, useViewport } from '@iot-app-kit/react-components';
import React from 'react';
import { aggregateToString } from '~/customization/propertiesSections/aggregationSettings/helpers';
import type { BarChartWidget } from '~/customization/widgets/types';
import { useQueries } from '~/dashboard/queryContext';
import { useDashboardDecimalPlaces } from '~/features/dashboard-settings/use-dashboard-decimal-places';
import { WidgetTile } from '~/features/widget-tile';
import { useChartSize } from '~/hooks/useChartSize';
import { createWidgetRenderKey } from '../utils/createWidgetRenderKey';
import { getAggregation } from '../utils/widgetAggregationUtils';

const BarChartWidgetComponent: React.FC<BarChartWidget> = (widget) => {
  const { viewport } = useViewport();
  const [dashboardSignificantDigits] = useDashboardDecimalPlaces();
  const chartSize = useChartSize(widget);

  const {
    title,
    queryConfig,
    styleSettings,
    axis,
    thresholdSettings,
    thresholds,
    significantDigits: widgetSignificantDigits,
  } = widget.properties;

  const queries = useQueries(queryConfig.query);
  /**
   * Adding query config to force re-render when adding or removing a datastream
   * This is required to fix a positioning bug when adding the first datastream
   * also a bug where removing the last datastream does not actually remove the bars.
   */
  const key =
    createWidgetRenderKey(widget.id) + JSON.stringify(queryConfig.query);
  const aggregation = getAggregation(widget);
  const significantDigits =
    widgetSignificantDigits ?? dashboardSignificantDigits;

  const size = { width: chartSize.width, height: chartSize.height };
  return (
    <WidgetTile widget={widget} title={title}>
      <BarChart
        chartSize={size}
        key={key}
        queries={queries}
        viewport={viewport}
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
