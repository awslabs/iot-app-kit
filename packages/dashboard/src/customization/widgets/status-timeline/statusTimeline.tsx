import * as React from 'react';
import { StatusTimeline, useViewport } from '@iot-app-kit/react-components';
import { useSelector } from 'react-redux';
import { DashboardState } from '~/store/state';
import { StatusTimelineWidget } from '../types';
import { useQueries } from '~/components/dashboard/queryContext';
import { createWidgetRenderKey } from '../utils/createWidgetRenderKey';
import { aggregateToString } from '~/customization/propertiesSections/formatDataSettings/helpers';
import { getAggregation } from '../utils/widgetAggregationUtils';
import WidgetTile from '~/components/widgets/tile';
import NoChartData from '../components/no-chart-data';
import { default as timelineSvgDark } from './timeline-dark.svg';

const StatusTimelineWidgetComponent: React.FC<StatusTimelineWidget> = (
  widget
) => {
  const { viewport } = useViewport();
  const readOnly = useSelector((state: DashboardState) => state.readOnly);
  const dashboardSignificantDigits = useSelector(
    (state: DashboardState) => state.significantDigits
  );

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
        gestures={readOnly}
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
