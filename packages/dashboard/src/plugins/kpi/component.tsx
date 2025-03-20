import { Box } from '@cloudscape-design/components';
import { KPI, useViewport } from '@iot-app-kit/react-components';
import pickBy from 'lodash-es/pickBy';
import { useSelector } from 'react-redux';
import { useQueries } from '../../features/queries/query-context';
import type { DashboardState } from '../../store/state';
import { isDefined } from '../../util/isDefined';
import type { KPI_WIDGET_TYPE } from './constants';
import './component.css';
import { WidgetTile } from '../../features/widget-customization/common/tile';
import { type WidgetComponentProps } from '../../features/widget-customization/types';
import { createWidgetRenderKey } from '../../features/widget-customization/common/create-widget-render-key';
import { type SiteWiseQueryConfig } from '~/features/queries/queries';
import { getAggregation } from '../../components/queryEditor/iotSiteWiseQueryEditor/useQuery/asset-default-styles';

export const KPIWidgetComponent = ({
  widget,
}: WidgetComponentProps<typeof KPI_WIDGET_TYPE>) => {
  const { viewport } = useViewport();
  const dashboardSignificantDigits = useSelector(
    (state: DashboardState) => state.decimalPlaces
  );
  const dashboardTimeZone = useSelector(
    (state: DashboardState) => state.timeZone
  );

  const {
    styleSettings,
    queryConfig = {
      source: 'iotsitewise',
      query: undefined,
    } satisfies SiteWiseQueryConfig,
    primaryFont = {},
    secondaryFont = {},
    showUnit = true,
    showAggregationAndResolution = true,
    showName = true,
    showTimestamp = true,
    showDataQuality = true,
    showValue,
    showIcon,
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
        aggregationType={aggregation}
        significantDigits={significantDigits}
        timeZone={dashboardTimeZone}
        assistant={assistant}
        titleText={title}
      />
    </WidgetTile>
  );
};

interface KPIWidgetEmptyStateComponentProps {
  title?: string;
}

const KPIWidgetEmptyStateComponent = ({
  title = 'KPI',
}: KPIWidgetEmptyStateComponentProps) => {
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
