import { StatusTimeline, useViewport } from '@iot-app-kit/react-components';
import { useSelector } from 'react-redux';
import { useQueries } from '~/features/queries/query-context';
import { type DashboardState } from '~/store/state';
import { default as timelineSvgDark } from './timeline-dark.svg';
import type { STATUS_TIMELINE_WIDGET_TYPE } from './constants';
import { type WidgetComponentProps } from '~/features/widget-customization/types';
import { WidgetTile } from '~/features/widget-customization/common/tile';
import { NoChartData } from '~/features/widget-customization/no-chart-data';
import { getAggregation } from '~/customization/widgets/utils/widgetAggregationUtils';
import { createWidgetRenderKey } from '~/customization/widgets/utils/createWidgetRenderKey';

export const StatusTimelineWidgetComponent = ({
  widget,
}: WidgetComponentProps<typeof STATUS_TIMELINE_WIDGET_TYPE>) => {
  const { viewport } = useViewport();
  const dashboardSignificantDigits = useSelector(
    (state: DashboardState) => state.decimalPlaces
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
