import Box from '@cloudscape-design/components/box';
import { KPI, useViewport } from '@iot-app-kit/react-components';
import pickBy from 'lodash/pickBy';
import React from 'react';
import { aggregateToString } from '~/customization/propertiesSections/aggregationSettings/helpers';
import { useQueries } from '~/dashboard/queryContext';
import { useDashboardDecimalPlaces } from '~/features/dashboard-settings/use-dashboard-decimal-places';
import { WidgetTile } from '~/features/widget-tile';
import { isDefined } from '~/helpers/isDefined';
import type { KPIWidget } from '../types';
import { createWidgetRenderKey } from '../utils/createWidgetRenderKey';
import { getAggregation } from '../utils/widgetAggregationUtils';
import './component.css';

const KPIWidgetComponent: React.FC<KPIWidget> = (widget) => {
  const { viewport } = useViewport();
  const [dashboardSignificantDigits] = useDashboardDecimalPlaces();
  /*
  const dashboardTimeZone = useSelector(
    (state: DashboardState) => state.present.timeZone
  );
  */
  const dashboardTimeZone = '';

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
