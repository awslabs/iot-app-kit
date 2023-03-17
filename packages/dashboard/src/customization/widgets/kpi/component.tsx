import React from 'react';
import { useSelector } from 'react-redux';
import { Kpi } from '@iot-app-kit/react-components';
import { computeQueryConfigKey } from '../utils/computeQueryConfigKey';
import type { Annotations, YAnnotation } from '@synchro-charts/core';
import type { DashboardState } from '~/store/state';
import type { KPIWidget } from '../types';
import { Box } from '@cloudscape-design/components';
import { useQueries } from '~/components/dashboard/queryContext';

import './component.css';

const KPIWidgetComponent: React.FC<KPIWidget> = (widget) => {
  const viewport = useSelector((state: DashboardState) => state.dashboardConfiguration.viewport);

  const { queryConfig, styleSettings, thresholdSettings } = widget.properties;

  const { iotSiteWiseQuery } = useQueries();
  const queries = iotSiteWiseQuery && queryConfig.query ? [iotSiteWiseQuery?.timeSeriesData(queryConfig.query)] : [];
  const key = computeQueryConfigKey(viewport, queryConfig);

  const annotations: Annotations = {
    y: thresholdSettings?.thresholds?.map(
      (t) =>
        ({
          id: t.id,
          comparisonOperator: t.comparisonOperator,
          color: t.color,
          value: t.comparisonValue,
        } as YAnnotation)
    ),
    colorDataAcrossThresholds: thresholdSettings?.colorAcrossThresholds,
  };

  const shouldShowEmptyState = queries.length === 0 || !iotSiteWiseQuery;

  if (shouldShowEmptyState) {
    return <KPIWidgetEmptyStateComponent />;
  }

  return (
    <Kpi key={key} queries={queries} viewport={viewport} styleSettings={styleSettings} annotations={annotations} />
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
