import Box from '@cloudscape-design/components/box';
import { Gauge, useViewport } from '@iot-app-kit/react-components';
import pickBy from 'lodash-es/pickBy';
import { useSelector } from 'react-redux';
import { useQueries } from '~/features/queries/query-context';
import { useChartSize } from '~/hooks/useChartSize';
import type { DashboardState } from '~/store/state';
import { isDefined } from '~/util/isDefined';
import './component.css';
import type { GAUGE_WIDGET_TYPE } from './constants';
import { type WidgetComponentProps } from '~/features/widget-customization/types';
import { WidgetTile } from '~/features/widget-customization/common/tile';
import { createWidgetRenderKey } from '~/features/widget-customization/common/create-widget-render-key';
import { DEFAULT_QUERY_CONFIG } from '~/features/queries/defaults';

export const GaugeWidgetComponent = ({
  widget,
}: WidgetComponentProps<typeof GAUGE_WIDGET_TYPE>) => {
  const { viewport } = useViewport();
  const dashboardSignificantDigits = useSelector(
    (state: DashboardState) => state.decimalPlaces
  );

  const {
    queryConfig = DEFAULT_QUERY_CONFIG,
    title,
    styleSettings,
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
        <GaugeWidgetEmptyStateComponent title={title} />
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
    <WidgetTile widget={widget} key={key} assistant={assistant}>
      <Gauge
        size={size}
        query={queries[0]}
        viewport={viewport}
        styles={styleSettings}
        settings={settings}
        thresholds={thresholds}
        significantDigits={significantDigits}
        assistant={assistant}
        titleText={title}
      />
    </WidgetTile>
  );
};

type GaugeWidgetEmptyStateComponentProps = { title?: string };
const GaugeWidgetEmptyStateComponent: React.FC<
  GaugeWidgetEmptyStateComponentProps
> = ({ title = 'Gauge' }: GaugeWidgetEmptyStateComponentProps) => {
  return (
    <div className='gauge-widget-empty-state'>
      <Box variant='strong' color='text-status-inactive' margin='s'>
        {title}
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
          Add a property or alarm to populate Gauge.
        </Box>
      </div>
    </div>
  );
};
