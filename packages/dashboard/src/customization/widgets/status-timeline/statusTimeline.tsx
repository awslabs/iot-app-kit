import * as React from 'react';
import { StatusTimeline } from '@iot-app-kit/react-components';
import { useSelector } from 'react-redux';
import { DashboardState } from '~/store/state';
import { StatusTimelineWidget } from '../types';
import { useQueries } from '~/components/dashboard/queryContext';
import { computeQueryConfigKey } from '../utils/computeQueryConfigKey';

const StatusTimelineWidgetComponent: React.FC<StatusTimelineWidget> = (widget) => {
  const viewport = useSelector((state: DashboardState) => state.dashboardConfiguration.viewport);
  const readOnly = useSelector((state: DashboardState) => state.readOnly);

  const { queryConfig, styleSettings, axis, thresholds } = widget.properties;

  const { iotSiteWiseQuery } = useQueries();
  const queries = iotSiteWiseQuery && queryConfig.query ? [iotSiteWiseQuery?.timeSeriesData(queryConfig.query)] : [];
  const key = computeQueryConfigKey(viewport, queryConfig);

  return (
    <StatusTimeline
      key={key}
      queries={queries}
      viewport={viewport}
      gestures={readOnly}
      axis={axis}
      styles={styleSettings}
      thresholds={thresholds}
    />
  );
};

export default StatusTimelineWidgetComponent;
