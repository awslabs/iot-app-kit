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
    title,
    styleSettings,
    queryConfig,
    showUnit,
    showName,
    fontSize,
    unitFontSize,
    labelFontSize,
    thresholds,
    significantDigits: widgetSignificantDigits,
    yMin,
    yMax,
    assistant,
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
      fontSize,
      unitFontSize,
      labelFontSize,
    },
    isDefined
  );

  const significantDigits =
    widgetSignificantDigits ?? dashboardSignificantDigits;

  // the 44 is from the widget tile header and top, bottom boder lines height
  // the 8 is from the left and right border lines width
  const size = { width: chartSize.width - 8, height: chartSize.height - 44 };

  return (
    <WidgetTile widget={widget} title={title} key={key}>
      <Gauge
        size={size}
        query={queries[0]}
        viewport={viewport}
        styles={styleSettings}
        settings={settings}
        thresholds={thresholds}
        significantDigits={significantDigits}
        assistant={assistant}
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
