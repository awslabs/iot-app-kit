import {
  WIDGET_INITIAL_HEIGHT,
  WIDGET_INITIAL_WIDTH,
  XY_PLOT_WIDGET_TYPE,
} from '~/plugins/xy-plot/constants';
import XYPlotWidgetComponent from './component';
import lineSvg from './line.svg';
import lineSvgDark from './line-dark.svg';
import type { XYPlotProperties } from './types';
import { StyleSettings } from './style-settings';
import { DataStreamSettings } from './data-stream-settings';
import { ThresholdSettings } from './threshold-settings';
import { Plugin } from '~/features/widget-plugins/plugin';
import { Registry } from '~/features/widget-plugins/registry';

declare module '~/features/widget-plugins/registry' {
  export interface RegisteredWidgetPlugins {
    [XY_PLOT_WIDGET_TYPE]: {
      properties: XYPlotProperties;
    };
  }
}

const plugin = new Plugin({
  type: XY_PLOT_WIDGET_TYPE,
  component: XYPlotWidgetComponent,
  name: 'Line',
  icon: {
    light: lineSvg,
    dark: lineSvgDark,
  },
  initialProperties: {
    aggregationType: 'AVERAGE',
    resolution: undefined,
    queryConfig: {
      source: 'iotsitewise',
      query: undefined,
    },
    line: {
      connectionStyle: 'linear',
      style: 'solid',
    },
    symbol: {
      style: 'filled-circle',
    },
    axis: {
      yVisible: true,
      xVisible: true,
    },
    legend: {
      visible: true,
      position: 'right',
      width: '30%',
      height: '30%',
      visibleContent: {
        unit: true,
        asset: true,
        latestValue: true,
        latestAlarmStateValue: true,
        maxValue: false,
        minValue: false,
      },
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
