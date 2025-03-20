import type { TextWidgetProperties } from './types';
import {
  TEXT_WIDGET_TYPE,
  WIDGET_INITIAL_HEIGHT,
  WIDGET_INITIAL_WIDTH,
} from './constants';
import textSvg from './text.svg';
import textSvgDark from './text-dark.svg';
import { TextWidgetComponent } from './component';
import { StyleSettings } from './style-settings';
import { Plugin } from '~/features/widget-plugins/plugin';
import { Registry } from '~/features/widget-plugins/registry';

declare module '~/features/widget-plugins/registry' {
  export interface RegisteredWidgetPlugins {
    [TEXT_WIDGET_TYPE]: {
      properties: TextWidgetProperties;
    };
  }
}

export const plugin = new Plugin({
  type: TEXT_WIDGET_TYPE,
  component: TextWidgetComponent,
  name: 'Text',
  icon: {
    light: textSvg,
    dark: textSvgDark,
  },
  initialProperties: {
    value: '',
  },
  initialSize: {
    height: WIDGET_INITIAL_HEIGHT,
    width: WIDGET_INITIAL_WIDTH,
  },
}).setStyleSettingsComponent(StyleSettings);

Registry.register(plugin);
