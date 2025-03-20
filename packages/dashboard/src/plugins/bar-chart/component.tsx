import { BarChart, useViewport } from '@iot-app-kit/react-components';
import { useSelector } from 'react-redux';
import { useQueries } from '~/features/queries/query-context';
import { useChartSize } from '~/hooks/useChartSize';
import type { DashboardState } from '~/store/state';
import type { BAR_CHART_WIDGET_TYPE } from './constants';
import { WidgetTile } from '~/features/widget-customization/common/tile';
import type { WidgetComponentProps } from '~/features/widget-customization/types';
import { DEFAULT_QUERY_CONFIG } from '~/features/queries/defaults';
import { createWidgetRenderKey } from '~/features/widget-customization/common/create-widget-render-key';

export const BarChartWidgetComponent = ({
  widget,
}: WidgetComponentProps<typeof BAR_CHART_WIDGET_TYPE>) => {
  const { viewport } = useViewport();
  const dashboardSignificantDigits = useSelector(
    (state: DashboardState) => state.decimalPlaces
  );
  const chartSize = useChartSize(widget);

  const {
    queryConfig = DEFAULT_QUERY_CONFIG,
    styleSettings,
    axis,
    thresholdSettings,
    thresholds,
    significantDigits: widgetSignificantDigits,
    title,
  } = widget.properties;

  const queries = useQueries(queryConfig.query);
  /**
   * Adding query config to force re-render when adding or removing a datastream
   * This is required to fix a positioning bug when adding the first datastream
   * also a bug where removing the last datastream does not actually remove the bars.
   */
  const key =
    createWidgetRenderKey(widget.id) + JSON.stringify(queryConfig.query);
  // const aggregation = getAggregation(widget);
  const significantDigits =
    widgetSignificantDigits ?? dashboardSignificantDigits;

  const size = { width: chartSize.width, height: chartSize.height };
  return (
    <WidgetTile widget={widget}>
      <BarChart
        chartSize={size}
        key={key}
        queries={queries}
        viewport={viewport}
        // FIXME
        // aggregationType={aggregation}
        axis={axis}
        styles={styleSettings}
        thresholds={thresholds}
        thresholdSettings={thresholdSettings}
        significantDigits={significantDigits}
        titleText={title}
      />
    </WidgetTile>
  );
};
