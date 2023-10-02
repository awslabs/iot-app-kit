import * as React from 'react';
import { StatusTimeline, useViewport } from '@iot-app-kit/react-components';
import { useSelector } from 'react-redux';
import { DashboardState } from '~/store/state';
import { StatusTimelineWidget } from '../types';
import { useQueries } from '~/components/dashboard/queryContext';
import { aggregateToString } from '~/customization/propertiesSections/aggregationSettings/helpers';
import { getAggregation } from '../utils/widgetAggregationUtils';
import WidgetTile from '~/components/widgets/tile';

const StatusTimelineWidgetComponent: React.FC<StatusTimelineWidget> = (widget) => {
  const { viewport } = useViewport();
  const readOnly = useSelector((state: DashboardState) => state.readOnly);
  const dashboardSignificantDigits = useSelector((state: DashboardState) => state.significantDigits);

  const {
    queryConfig,
    styleSettings,
    axis,
    thresholds,
    significantDigits: widgetSignificantDigits,
  } = widget.properties;

  const { iotSiteWiseQuery } = useQueries();
  const queries = iotSiteWiseQuery && queryConfig.query ? [iotSiteWiseQuery?.timeSeriesData(queryConfig.query)] : [];
  const key = widget.id;
  const aggregation = getAggregation(widget);

  const significantDigits = widgetSignificantDigits ?? dashboardSignificantDigits;

  return (
    <WidgetTile widget={widget} removeable>
      <StatusTimeline
        key={key}
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
