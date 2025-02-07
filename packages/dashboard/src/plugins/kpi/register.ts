import {
  KPI_WIDGET_TYPE,
  WIDGET_INITIAL_HEIGHT,
  WIDGET_INITIAL_WIDTH,
} from './constants';
import { KPIWidgetComponent } from './component';
import { StyleSettings } from './style-settings';
import { DataStreamSettings } from './data-stream-settings';
import { ThresholdSettings } from './threshold-settings';
import { default as KPISvg } from './KPI.svg';
import { default as KPISvgDark } from './KPI-dark.svg';
import { type KPIProperties } from '~/plugins/kpi/types';
import { Plugin } from '~/features/widget-plugins/plugin';
import { Registry } from '~/features/widget-plugins/registry';

declare module '~/features/widget-plugins/registry' {
  export interface RegisteredWidgetPlugins {
    [KPI_WIDGET_TYPE]: {
      properties: KPIProperties;
    };
  }
}

const plugin = new Plugin({
  type: KPI_WIDGET_TYPE,
  name: 'KPI',
  icon: { light: KPISvg, dark: KPISvgDark },
  component: KPIWidgetComponent,
  initialProperties: {
    queryConfig: {
      source: 'iotsitewise',
      query: {
        requestSettings: {
          resolution: undefined,
        },
      },
    },
    primaryFont: {},
    secondaryFont: {},
    showName: true,
    showTimestamp: true,
    showUnit: true,
    showAggregationAndResolution: true,
    showDataQuality: true,
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
