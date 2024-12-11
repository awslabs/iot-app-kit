import { BarChart, useViewport } from '@iot-app-kit/react-components';
import { useSelector } from 'react-redux';
import { useQueries } from '../../../components/dashboard/queryContext';
import WidgetTile from '../../../components/widgets/tile';
import { aggregateToString } from '../../../customization/propertiesSections/aggregationSettings/helpers';
import { useChartSize } from '../../../hooks/useChartSize';
import type { DashboardState } from '../../../store/state-old';
import type { BarChartWidget } from '.././types';
import { createWidgetRenderKey } from '../utils/createWidgetRenderKey';
import { getAggregation } from '../utils/widgetAggregationUtils';

const BarChartWidgetComponent: React.FC<BarChartWidget> = (widget) => {
  const { viewport } = useViewport();
  const dashboardSignificantDigits = useSelector(
    (state: DashboardState) => state.significantDigits
  );
  const chartSize = useChartSize(widget);

  const {
    queryConfig,
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
  const aggregation = getAggregation(widget);
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
        aggregationType={aggregateToString(aggregation)}
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

export default BarChartWidgetComponent;
