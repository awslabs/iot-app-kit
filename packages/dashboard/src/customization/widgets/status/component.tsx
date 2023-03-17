import React from 'react';
import { useSelector } from 'react-redux';
import { StatusGrid } from '@iot-app-kit/react-components';
import { computeQueryConfigKey } from '../utils/computeQueryConfigKey';
import type { Annotations, YAnnotation } from '@synchro-charts/core';
import type { DashboardState } from '~/store/state';
import type { StatusWidget } from '../types';
import { Box } from '@cloudscape-design/components';
import './component.css';
import { useQueries } from '~/components/dashboard/queryContext';

const StatusWidgetComponent: React.FC<StatusWidget> = (widget) => {
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

  const shouldShowEmptyState = !queries.length || !iotSiteWiseQuery;

  if (shouldShowEmptyState) {
    return <StatusWidgetEmptyStateComponent />;
  }

  return (
    <StatusGrid
      key={key}
      queries={queries}
      viewport={viewport}
      styleSettings={styleSettings}
      annotations={annotations}
    />
  );
};

const StatusWidgetEmptyStateComponent: React.FC = () => {
  return (
    <div className='status-widget-empty-state'>
      <Box variant='strong' color='text-status-inactive' margin='s'>
        Status
      </Box>

      <div className='status-widget-empty-state-message-container'>
        <Box variant='strong' color='text-status-inactive' margin={{ horizontal: 's' }}>
          No properties or alarms
        </Box>

        <Box variant='p' color='text-status-inactive' margin={{ bottom: 's', horizontal: 's' }}>
          Add a property or alarm to populate status chart
        </Box>
      </div>
    </div>
  );
};

export default StatusWidgetComponent;
