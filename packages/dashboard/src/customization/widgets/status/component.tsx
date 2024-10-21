import Box from '@cloudscape-design/components/box';
import { Status, useViewport } from '@iot-app-kit/react-components';
import pickBy from 'lodash/pickBy';
import React from 'react';
import { aggregateToString } from '~/customization/propertiesSections/aggregationSettings/helpers';
import { useQueries } from '~/dashboard/queryContext';
import { useDashboardDecimalPlaces } from '~/features/dashboard-settings/use-dashboard-decimal-places';
import { WidgetTile } from '~/features/widget-tile';
import { isDefined } from '~/helpers/isDefined';
import type { StatusWidget } from '../types';
import { createWidgetRenderKey } from '../utils/createWidgetRenderKey';
import { getAggregation } from '../utils/widgetAggregationUtils';
import './component.css';

const StatusWidgetComponent: React.FC<StatusWidget> = (widget) => {
  const { viewport } = useViewport();
  const [dashboardSignificantDigits] = useDashboardDecimalPlaces();

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
    showAggregationAndResolution,
    thresholds,
    backgroundColor,
    significantDigits: widgetSignificantDigits,
  } = widget.properties;

  const queries = useQueries(queryConfig.query);
  const shouldShowEmptyState = queries.length === 0;
  const key = createWidgetRenderKey(widget.id);
  const aggregation = getAggregation(widget);

  if (shouldShowEmptyState) {
    return (
      <WidgetTile widget={widget}>
        <StatusWidgetEmptyStateComponent />
      </WidgetTile>
    );
  }

  const settings = pickBy(
    {
      showName,
      showIcon,
      showValue,
      showUnit,
      showTimestamp,
      showAggregationAndResolution,
      fontSize: primaryFont.fontSize,
      color: primaryFont.fontColor,
      backgroundColor,
      secondaryFontSize: secondaryFont.fontSize,
    },
    isDefined
  );

  const significantDigits =
    widgetSignificantDigits ?? dashboardSignificantDigits;

  return (
    <Status
      key={key}
      query={queries[0]}
      viewport={viewport}
      styles={styleSettings}
      settings={settings}
      thresholds={thresholds}
      aggregationType={aggregateToString(aggregation)}
      significantDigits={significantDigits}
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
          Add a property or alarm to populate status
        </Box>
      </div>
    </div>
  );
};

export default StatusWidgetComponent;
