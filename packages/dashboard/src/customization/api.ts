import type * as React from 'react';
import plugins from '~/customization/pluginsConfiguration';
import {
  ComponentLibraryComponentMap,
  ComponentLibraryComponentOrdering,
} from './componentLibraryComponentMap';
import { WidgetComponentMap } from './widgetComponentMap';
import { WidgetPropertiesGeneratorMap } from './widgetPropertiesGeneratorMap';
import type {
  Widget,
  DashboardWidgetRegistry,
  RegisteredWidgetType,
} from '~/types/widgets';

type RenderFunc<W extends Widget> = (widget: W) => React.ReactElement;

type WidgetRegistrationOptions<T extends RegisteredWidgetType> = {
  render: RenderFunc<Widget<T>>;
  componentLibrary?: {
    name: string;
    icon: React.FC;
  };
  properties?: () => DashboardWidgetRegistry[T];
  initialSize?: Pick<Widget, 'height' | 'width'>;
};
type RegisterWidget<T extends RegisteredWidgetType> = (
  type: T,
  options: WidgetRegistrationOptions<T>
) => void;

/**
 * function to register a new widget type in the dashboard
 */
export const registerWidget = <T extends RegisteredWidgetType>(
  type: T,
  options: WidgetRegistrationOptions<T>
) => {
  const { render, componentLibrary, properties, initialSize } = options;
  WidgetComponentMap[type] = render;

  if (componentLibrary) {
    const { name, icon } = componentLibrary;
    ComponentLibraryComponentMap[type] = [name, icon];
    ComponentLibraryComponentOrdering.push(type);
  }

  if (properties || initialSize) {
    WidgetPropertiesGeneratorMap[type] = {
      properties,
      initialSize,
    };
  }
};

export type DashboardPlugin<T extends RegisteredWidgetType> = {
  install: (options: { registerWidget: RegisterWidget<T> }) => void;
};

const resetMaps = () => {
  // eslint-disable-next-line
  const clearObj = (obj: Record<any, any>) => {
    for (const key in obj) {
      // eslint-disable-next-line
      if (obj.hasOwnProperty(key)) {
        delete obj[key];
      }
    }
  };
  // eslint-disable-next-line
  const clearArr = (arr: any[]) => {
    arr.splice(0, arr.length);
  };
  // resets for hotmodule reloading;
  clearObj(WidgetComponentMap);
  clearObj(ComponentLibraryComponentMap);
  clearObj(WidgetPropertiesGeneratorMap);
  clearArr(ComponentLibraryComponentOrdering);
};

export const useDashboardPlugins = () => {
  resetMaps();
  plugins.forEach((plugin) => plugin.install({ registerWidget }));
};
