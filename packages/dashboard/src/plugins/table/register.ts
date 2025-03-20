import {
  TABLE_WIDGET_TYPE,
  WIDGET_INITIAL_HEIGHT,
  WIDGET_INITIAL_WIDTH,
} from './constants';
import { TableWidgetComponent } from './component';
import tableSvg from './table.svg';
import tableSvgDark from './table-dark.svg';
import { type TableWidgetProperties } from './types';
import { DataStreamSettings } from './data-stream-settings';
import { ThresholdSettings } from './threshold-settings';
import { StyleSettings } from './style-settings';
import { Plugin } from '~/features/widget-plugins/plugin';
import { Registry } from '~/features/widget-plugins/registry';

declare module '~/features/widget-plugins/registry' {
  export interface RegisteredWidgetPlugins {
    [TABLE_WIDGET_TYPE]: {
      properties: TableWidgetProperties;
    };
  }
}

const plugin = new Plugin({
  type: TABLE_WIDGET_TYPE,
  component: TableWidgetComponent,
  name: 'Table',
  icon: {
    light: tableSvg,
    dark: tableSvgDark,
  },
  initialProperties: {
    queryConfig: {
      source: 'iotsitewise',
      query: undefined,
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
