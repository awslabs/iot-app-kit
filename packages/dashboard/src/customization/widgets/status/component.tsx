import React from 'react';
import { useSelector } from 'react-redux';
import pickBy from 'lodash/pickBy';
import { Status, useViewport } from '@iot-app-kit/react-components';
import { createWidgetRenderKey } from '../utils/createWidgetRenderKey';
import type { DashboardState } from '~/store/state';
import type { StatusWidget } from '../types';
import { Box } from '@cloudscape-design/components';
import { useQueries } from '~/components/dashboard/queryContext';
import { isDefined } from '~/util/isDefined';
import { aggregateToString } from '~/customization/propertiesSections/aggregationSettings/helpers';
import { getAggregation } from '../utils/widgetAggregationUtils';
import './component.css';
import WidgetTile from '~/components/widgets/tile/tile';

const StatusWidgetComponent: React.FC<StatusWidget> = (widget) => {
  const { viewport } = useViewport();
  const dashboardSignificantDigits = useSelector(
    (state: DashboardState) => state.significantDigits
  );

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
      <WidgetTile widget={widget} removeable>
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
