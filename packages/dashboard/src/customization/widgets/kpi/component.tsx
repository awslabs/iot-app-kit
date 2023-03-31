import React from 'react';
import { useSelector } from 'react-redux';
import pickBy from 'lodash/pickBy';
import { KPI } from '@iot-app-kit/react-components';
import { computeQueryConfigKey } from '../utils/computeQueryConfigKey';
import type { DashboardState } from '~/store/state';
import type { KPIWidget } from '../types';
import { Box } from '@cloudscape-design/components';
import { useQueries } from '~/components/dashboard/queryContext';
import { isDefined } from '~/util/isDefined';

import './component.css';

const KPIWidgetComponent: React.FC<KPIWidget> = (widget) => {
  const viewport = useSelector((state: DashboardState) => state.dashboardConfiguration.viewport);

  const {
    styleSettings,
    queryConfig,
    primaryFont,
    secondaryFont,
    showValue,
    showUnit,
    showIcon,
    showName,
    showTimestamp,
    thresholds,
  } = widget.properties;

  const { iotSiteWiseQuery } = useQueries();
  const query = iotSiteWiseQuery && queryConfig.query ? iotSiteWiseQuery?.timeSeriesData(queryConfig.query) : undefined;
  const key = computeQueryConfigKey(viewport, queryConfig);

  const shouldShowEmptyState = query == null || !iotSiteWiseQuery;

  if (shouldShowEmptyState) {
    return <KPIWidgetEmptyStateComponent />;
  }

  const settings = pickBy(
    {
      showName,
      showIcon,
      showValue,
      showUnit,
      showTimestamp,
      fontSize: primaryFont.fontSize,
      color: primaryFont.fontColor,
      secondaryFontSize: secondaryFont.fontSize,
    },
    isDefined
  );

  return (
    <KPI
      key={key}
      query={query}
      viewport={viewport}
      styles={styleSettings}
      settings={settings}
      thresholds={thresholds}
    />
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
          Add a property or alarm to populate KPI
        </Box>
      </div>
    </div>
  );
};

export default KPIWidgetComponent;
