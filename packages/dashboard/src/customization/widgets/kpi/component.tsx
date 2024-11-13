import { Box } from '@cloudscape-design/components';
import { KPI, useViewport } from '@iot-app-kit/react-components';
import pickBy from 'lodash/pickBy';
import { useSelector } from 'react-redux';
import { useQueries } from '~/components/dashboard/queryContext';
import type { DashboardState } from '~/store/state';
import { isDefined } from '~/util/isDefined';
import type { KPIWidget } from '../types';
import { createWidgetRenderKey } from '../utils/createWidgetRenderKey';
import { getAggregation } from '../utils/widgetAggregationUtils';

import WidgetTile from '~/components/widgets/tile';
import { aggregateToString } from '~/customization/propertiesSections/aggregationSettings/helpers';
import './component.css';

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
    assistant,
    title,
  } = widget.properties;

  const queries = useQueries(queryConfig.query);
  const key = createWidgetRenderKey(widget.id);
  const aggregation = getAggregation(widget);

  const shouldShowEmptyState = queries.length === 0;

  if (shouldShowEmptyState) {
    return (
      <WidgetTile widget={widget}>
        <KPIWidgetEmptyStateComponent title={title} />
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
    <WidgetTile widget={widget} key={key} assistant={assistant}>
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
        titleText={title}
      />
    </WidgetTile>
  );
};

type KPIWidgetEmptyStateComponentProps = { title?: string };
const KPIWidgetEmptyStateComponent: React.FC<
  KPIWidgetEmptyStateComponentProps
> = ({ title = 'KPI' }: KPIWidgetEmptyStateComponentProps) => {
  return (
    <div className='kpi-widget-empty-state'>
      <Box variant='strong' color='text-status-inactive' margin='s'>
        {title}
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
          Add a property or alarm to populate KPI.
        </Box>
      </div>
    </div>
  );
};

export default KPIWidgetComponent;
