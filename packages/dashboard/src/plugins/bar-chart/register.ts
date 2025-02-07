import {
  BAR_CHART_WIDGET_TYPE,
  WIDGET_INITIAL_HEIGHT,
  WIDGET_INITIAL_WIDTH,
} from './constants';
import { BarChartWidgetComponent } from './component';
import { default as barSvg } from './bar.svg';
import { default as barSvgDark } from './bar-dark.svg';
import { type BarChartProperties } from './types';
import { StyleSettings } from './style-settings';
import { DataStreamSettings } from './data-stream-settings';
import { ThresholdSettings } from './threshold-settings';
import { Plugin } from '~/features/widget-plugins/plugin';
import { Registry } from '~/features/widget-plugins/registry';

declare module '~/features/widget-plugins/registry' {
  export interface RegisteredWidgetPlugins {
    [BAR_CHART_WIDGET_TYPE]: {
      properties: BarChartProperties;
    };
  }
}

const plugin = new Plugin({
  type: BAR_CHART_WIDGET_TYPE,
  name: 'Bar',
  icon: { light: barSvg, dark: barSvgDark },
  component: BarChartWidgetComponent,
  initialProperties: {
    aggregationType: 'AVERAGE',
    resolution: undefined,
    queryConfig: {
      source: 'iotsitewise',
      query: undefined,
    },
    axis: {
      showX: true,
      showY: true,
    },
  },
  initialSize: {
    height: WIDGET_INITIAL_HEIGHT,
    width: WIDGET_INITIAL_WIDTH,
  },
})
  .setStyleSettingsComponent(StyleSettings)
  .setDataStreamSettingsComponent(DataStreamSettings)
  .setThresholdSettingsComponent(ThresholdSettings);

Registry.register(plugin);
