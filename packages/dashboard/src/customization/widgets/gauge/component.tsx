import React from 'react';
import { useSelector } from 'react-redux';
import pickBy from 'lodash/pickBy';
import { Gauge, useViewport } from '@iot-app-kit/react-components';
import { createWidgetRenderKey } from '../utils/createWidgetRenderKey';
import type { DashboardState } from '~/store/state';
import type { GaugeWidget } from '../types';
import { Box } from '@cloudscape-design/components';
import { useQueries } from '~/components/dashboard/queryContext';
import { isDefined } from '~/util/isDefined';

import WidgetTile from '~/components/widgets/tile';
import { useChartSize } from '~/hooks/useChartSize';
import './component.css';

const GaugeWidgetComponent: React.FC<GaugeWidget> = (widget) => {
  const { viewport } = useViewport();
  const dashboardSignificantDigits = useSelector(
    (state: DashboardState) => state.significantDigits
  );

  const {
    styleSettings,
    queryConfig,
    showUnit,
    showName,
    thresholds,
    significantDigits: widgetSignificantDigits,
    yMin,
    yMax,
  } = widget.properties;

  const queries = useQueries(queryConfig.query);
  const key = createWidgetRenderKey(widget.id);
  const chartSize = useChartSize(widget);

  const shouldShowEmptyState = queries.length === 0;

  if (shouldShowEmptyState) {
    return (
      <WidgetTile widget={widget}>
        <GaugeWidgetEmptyStateComponent />
      </WidgetTile>
    );
  }

  const settings = pickBy(
    {
      yMin,
      yMax,
      showName,
      showUnit,
    },
    isDefined
  );

  const significantDigits =
    widgetSignificantDigits ?? dashboardSignificantDigits;

  const size = { width: chartSize.width - 8, height: chartSize.height - 8 };

  return (
    <WidgetTile widget={widget} key={key}>
      <Gauge
        size={size}
        query={queries[0]}
        viewport={viewport}
        styles={styleSettings}
        settings={settings}
        thresholds={thresholds}
        significantDigits={significantDigits}
      />
    </WidgetTile>
  );
};

const GaugeWidgetEmptyStateComponent: React.FC = () => {
  return (
    <div className='gauge-widget-empty-state'>
      <Box variant='strong' color='text-status-inactive' margin='s'>
        Gauge
      </Box>

      <div className='gauge-widget-empty-state-message-container'>
        <Box
          variant='strong'
          color='text-status-inactive'
          margin={{ horizontal: 's' }}
        >
          No properties or alarms
        </Box>

        <Box
          variant='p'
          color='text-status-inactive'
          margin={{ bottom: 's', horizontal: 's' }}
        >
          Add a property or alarm to populate Gauge
        </Box>
      </div>
    </div>
  );
};

export default GaugeWidgetComponent;
