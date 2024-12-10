import { StatusTimeline, useViewport } from '@iot-app-kit/react-components';
import { useSelector } from 'react-redux';
import { useQueries } from '../../../components/dashboard/queryContext';
import WidgetTile from '../../../components/widgets/tile';
import { aggregateToString } from '../../../customization/propertiesSections/aggregationSettings/helpers';
import { type DashboardState } from '../../../store/state';
import NoChartData from '../components/no-chart-data';
import { type StatusTimelineWidget } from '../types';
import { createWidgetRenderKey } from '../utils/createWidgetRenderKey';
import { getAggregation } from '../utils/widgetAggregationUtils';
import { default as timelineSvgDark } from './timeline-dark.svg';

const StatusTimelineWidgetComponent: React.FC<StatusTimelineWidget> = (
  widget
) => {
  const { viewport } = useViewport();
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
          emptyStateText='Browse assets and add asset properties to the status timeline widget.'
        />
      </WidgetTile>
    );
  }

  return (
    <WidgetTile widget={widget} key={key}>
      <StatusTimeline
        queries={queries}
        viewport={viewport}
        axis={axis}
        styles={styleSettings}
        thresholds={thresholds}
        aggregationType={aggregateToString(aggregation)}
        significantDigits={significantDigits}
        titleText={title}
      />
    </WidgetTile>
  );
};

export default StatusTimelineWidgetComponent;
