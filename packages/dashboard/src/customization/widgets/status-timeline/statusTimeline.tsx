import { StatusTimeline, useViewport } from '@iot-app-kit/react-components';
import * as React from 'react';
import { aggregateToString } from '~/customization/propertiesSections/aggregationSettings/helpers';
import type { StatusTimelineWidget } from '~/customization/widgets/types';
import { useQueries } from '~/dashboard/queryContext';
import { useDashboardDecimalPlaces } from '~/features/dashboard-settings/use-dashboard-decimal-places';
import { WidgetTile } from '~/features/widget-tile';
import NoChartData from '../components/no-chart-data';
import { createWidgetRenderKey } from '../utils/createWidgetRenderKey';
import { getAggregation } from '../utils/widgetAggregationUtils';
import { default as timelineSvgDark } from './timeline-dark.svg';

const StatusTimelineWidgetComponent: React.FC<StatusTimelineWidget> = (
  widget
) => {
  const { viewport } = useViewport();
  const [dashboardSignificantDigits] = useDashboardDecimalPlaces();

  const {
    title,
    queryConfig,
    styleSettings,
    axis,
    thresholds,
    significantDigits: widgetSignificantDigits,
  } = widget.properties;

  const queries = useQueries(queryConfig.query);
  const key = createWidgetRenderKey(widget.id);
  const aggregation = getAggregation(widget);

  const significantDigits =
    widgetSignificantDigits ?? dashboardSignificantDigits;

  const isEmptyWidget = queries.length === 0;
  if (isEmptyWidget) {
    return (
      <WidgetTile widget={widget}>
        <NoChartData
          icon={timelineSvgDark}
          emptyStateText='Browse and select to add your asset properties in your status timeline widget.'
        />
      </WidgetTile>
    );
  }

  return (
    <WidgetTile widget={widget} title={title} key={key}>
      <StatusTimeline
        queries={queries}
        viewport={viewport}
        axis={axis}
        styles={styleSettings}
        thresholds={thresholds}
        aggregationType={aggregateToString(aggregation)}
        significantDigits={significantDigits}
      />
    </WidgetTile>
  );
};

export default StatusTimelineWidgetComponent;
