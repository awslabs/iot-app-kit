import {
  GAUGE_WIDGET_INITIAL_HEIGHT,
  GAUGE_WIDGET_INITIAL_WIDTH,
  GAUGE_WIDGET_TYPE,
} from './constants';
import { GaugeWidgetComponent } from './component';
import { default as GaugeSvg } from './gauge.svg';
import { default as GaugeSvgDark } from './gauge-dark.svg';
import type { GaugeProperties } from './types';
import { StyleSettings } from './style-settings';
import { DataStreamSettings } from './data-stream-settings';
import { ThresholdSettings } from './threshold-settings';
import { Plugin } from '~/features/widget-plugins/plugin';
import { Registry } from '~/features/widget-plugins/registry';

declare module '~/features/widget-plugins/registry' {
  export interface RegisteredWidgetPlugins {
    [GAUGE_WIDGET_TYPE]: {
      properties: GaugeProperties;
    };
  }
}

const plugin = new Plugin({
  type: GAUGE_WIDGET_TYPE,
  component: GaugeWidgetComponent,
  name: 'Gauge',
  icon: { light: GaugeSvg, dark: GaugeSvgDark },
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
})
  .setStyleSettingsComponent(StyleSettings)
  .setDataStreamSettingsComponent(DataStreamSettings)
  .setThresholdSettingsComponent(ThresholdSettings);

Registry.register(plugin);
