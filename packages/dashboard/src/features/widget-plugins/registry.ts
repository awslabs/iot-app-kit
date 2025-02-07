import type { Plugin } from './plugin';

/**
 * Map of registered widget types and their properties.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RegisteredWidgetPlugins {}

/**
 * Union of all registered widget types.
 */
export type RegisteredWidgetType = keyof RegisteredWidgetPlugins;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const pluginRegistry: Record<string, Plugin<any>> = {};

/**
 * Widget plugin registry providing storage and access of widget-plugins.
 */
export class Registry {
  static register<WidgetType extends RegisteredWidgetType>(
    plugin: Plugin<WidgetType>
  ) {
    pluginRegistry[plugin.configuration.type] = plugin;
  }

  static get<WidgetType extends RegisteredWidgetType>(
    type: WidgetType
  ): Plugin<WidgetType> {
    return pluginRegistry[type];
  }

  static list(): Plugin[] {
    return Object.values(pluginRegistry);
  }
}
