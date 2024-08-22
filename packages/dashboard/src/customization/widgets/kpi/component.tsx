import React from 'react';
import { useSelector } from 'react-redux';
import pickBy from 'lodash/pickBy';
import { KPI, useViewport } from '@iot-app-kit/react-components';
import { createWidgetRenderKey } from '../utils/createWidgetRenderKey';
import type { DashboardState } from '~/store/state';
import type { KPIWidget } from '../types';
import { Box } from '@cloudscape-design/components';
import { useQueries } from '~/components/dashboard/queryContext';
import { isDefined } from '~/util/isDefined';
import { getAggregation } from '../utils/widgetAggregationUtils';

import './component.css';
import { aggregateToString } from '~/customization/propertiesSections/aggregationSettings/helpers';
import WidgetTile from '~/components/widgets/tile';

const KPIWidgetComponent: React.FC<KPIWidget> = (widget) => {
  const { viewport } = useViewport();
  const dashboardSignificantDigits = useSelector(
    (state: DashboardState) => state.significantDigits
  );
  const dashboardTimeZone = useSelector(
    (state: DashboardState) => state.timeZone
  );

  const {
    styleSettings,
    queryConfig,
    primaryFont,
    secondaryFont,
    showValue,
    showUnit,
    showIcon,
    showAggregationAndResolution,
    showName,
    showTimestamp,
    showDataQuality,
    backgroundColor,
    thresholds,
    significantDigits: widgetSignificantDigits,
    assistant
  } = widget.properties;

  const queries = useQueries(queryConfig.query);
  const key = createWidgetRenderKey(widget.id);
  const aggregation = getAggregation(widget);

  const shouldShowEmptyState = queries.length === 0;

  if (shouldShowEmptyState) {
    return (
      <WidgetTile widget={widget}>
        <KPIWidgetEmptyStateComponent />
      </WidgetTile>
    );
  }

  const settings = pickBy(
    {
      showName,
      showIcon,
      showAggregationAndResolution,
      showValue,
      showUnit,
      showTimestamp,
      showDataQuality,
      backgroundColor,
      fontSize: primaryFont.fontSize,
      color: primaryFont.fontColor,
      secondaryFontSize: secondaryFont.fontSize,
    },
    isDefined
  );

  const significantDigits =
    widgetSignificantDigits ?? dashboardSignificantDigits;

  return (
    <WidgetTile widget={widget} key={key}>
      <KPI
        query={queries[0]}
        viewport={viewport}
        styles={styleSettings}
        settings={settings}
        thresholds={thresholds}
        aggregationType={aggregateToString(aggregation)}
        significantDigits={significantDigits}
        timeZone={dashboardTimeZone}
        assistant={assistant}
      />
    </WidgetTile>
  );
};

const KPIWidgetEmptyStateComponent: React.FC = () => {
  return (
    <div className='kpi-widget-empty-state'>
      <Box variant='strong' color='text-status-inactive' margin='s'>
        KPI
      </Box>

      <div className='kpi-widget-empty-state-message-container'>
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
          Add a property or alarm to populate KPI
        </Box>
      </div>
    </div>
  );
};

export default KPIWidgetComponent;
