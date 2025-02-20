import GaugeWidgetComponent from './component';
import { default as GaugeSvg } from './gauge.svg';
import { default as GaugeSvgDark } from './gauge-dark.svg';
import {
  GAUGE_WIDGET_INITIAL_HEIGHT,
  GAUGE_WIDGET_INITIAL_WIDTH,
} from '../constants';
import { registerWidget } from '~/widgets/widget-registry';
import WidgetIcon from '../components/widgetIcon';

registerWidget({
  type: 'gauge',
  render: (widget) => <GaugeWidgetComponent {...widget} />,
  name: 'Gauge',
  icon: (
    <WidgetIcon widget='gauge' defaultIcon={GaugeSvg} darkIcon={GaugeSvgDark} />
  ),
  initialProperties: {
    queryConfig: {
      source: 'iotsitewise',
      query: undefined,
    },
    showName: true,
    showUnit: true,
    fontSize: 40,
    unitFontSize: 16,
    labelFontSize: 16,
    yMin: 0,
    yMax: 100,
    thresholds: [],
  },
  initialSize: {
    height: GAUGE_WIDGET_INITIAL_HEIGHT,
    width: GAUGE_WIDGET_INITIAL_WIDTH,
  },
});
