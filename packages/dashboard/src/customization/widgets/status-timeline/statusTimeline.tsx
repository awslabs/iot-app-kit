import * as React from 'react';
import { StatusTimeline } from '@iot-app-kit/react-components';
import { useSelector } from 'react-redux';
import { DashboardState } from '~/store/state';
import { StatusTimelineWidget } from '../types';
import { useQueries } from '~/components/dashboard/queryContext';
import { computeQueryConfigKey } from '../utils/computeQueryConfigKey';
import { aggregateToString } from '~/customization/propertiesSections/aggregationSettings/helpers';
import { getAggregation } from '../utils/widgetAggregationUtils';
import WidgetTile from '~/components/widgets/tile';
import { SiteWiseAssetQuery } from '@iot-app-kit/source-iotsitewise';

const StatusTimelineWidgetComponent: React.FC<StatusTimelineWidget> = (widget) => {
  const viewport = useSelector((state: DashboardState) => state.dashboardConfiguration.viewport);
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
  const queries =
    iotSiteWiseQuery && queryConfig.query
      ? [iotSiteWiseQuery?.timeSeriesData(queryConfig.query as SiteWiseAssetQuery)]
      : [];
  const key = computeQueryConfigKey(viewport, queryConfig);
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
