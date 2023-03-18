import React from 'react';
import { useSelector } from 'react-redux';
import { Kpi } from '@iot-app-kit/react-components';
import { computeQueryConfigKey } from '../utils/computeQueryConfigKey';
import type { DashboardState } from '~/store/state';
import type { KPIWidget } from '../types';
import type { Threshold } from '@iot-app-kit/core';
import { Box } from '@cloudscape-design/components';
import { useQueries } from '~/components/dashboard/queryContext';

import './component.css';

const KPIWidgetComponent: React.FC<KPIWidget> = (widget) => {
  const viewport = useSelector((state: DashboardState) => state.dashboardConfiguration.viewport);

  const { queryConfig, styleSettings, thresholdSettings } = widget.properties;

  const { iotSiteWiseQuery } = useQueries();
  const query = iotSiteWiseQuery && queryConfig.query ? iotSiteWiseQuery?.timeSeriesData(queryConfig.query) : undefined;
  const key = computeQueryConfigKey(viewport, queryConfig);

  const shouldShowEmptyState = query == null || !iotSiteWiseQuery;

  if (shouldShowEmptyState) {
    return <KPIWidgetEmptyStateComponent />;
  }
  const thresholds =
    thresholdSettings?.thresholds.map(({ comparisonValue: value, ...rest }) => ({ ...rest, value })) || [];
  return (
    <Kpi key={key} query={query} viewport={viewport} styles={styleSettings} thresholds={thresholds as Threshold[]} />
  );
};

const KPIWidgetEmptyStateComponent: React.FC = () => {
  return (
    <div className='kpi-widget-empty-state'>
      <Box variant='strong' color='text-status-inactive' margin='s'>
        KPI
      </Box>

      <div className='kpi-widget-empty-state-message-container'>
        <Box variant='strong' color='text-status-inactive' margin={{ horizontal: 's' }}>
          No properties or alarms
        </Box>

        <Box variant='p' color='text-status-inactive' margin={{ bottom: 's', horizontal: 's' }}>
          Add a property or alarm to populate KPI chart
        </Box>
      </div>
    </div>
  );
};

export default KPIWidgetComponent;
