import {
  STATUS_TIMELINE_WIDGET_TYPE,
  WIDGET_INITIAL_HEIGHT,
  WIDGET_INITIAL_WIDTH,
} from './constants';
import { StatusTimelineWidgetComponent } from './component';
import { type StatusTimelineProperties } from './types';
import timelineSvg from './timeline.svg';
import timelineSvgDark from './timeline-dark.svg';
import { StyleSettings } from './style-settings';
import { DataStreamSettings } from './data-stream-settings';
import { ThresholdSettings } from './threshold-settings';
import { Plugin } from '~/features/widget-plugins/plugin';
import { Registry } from '~/features/widget-plugins/registry';

declare module '~/features/widget-plugins/registry' {
  export interface RegisteredWidgetPlugins {
    [STATUS_TIMELINE_WIDGET_TYPE]: {
      properties: StatusTimelineProperties;
    };
  }
}

const plugin = new Plugin({
  type: STATUS_TIMELINE_WIDGET_TYPE,
  component: StatusTimelineWidgetComponent,
  name: 'Timeline',
  icon: {
    light: timelineSvg,
    dark: timelineSvgDark,
  },
  initialProperties: {
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
