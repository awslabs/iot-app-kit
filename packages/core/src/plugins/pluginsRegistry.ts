import type { LoggerSettings } from './loggerSettings';
import type { MetricsRecorderSettings } from './metricsRecorderSettings';

interface PluginsRegistry {
  logger: LoggerSettings;
  metricsRecorder: MetricsRecorderSettings;
}

/**
 * Internal object to hold all of the plugins.
 *
 * @emarks Not exported to encapsulate the registry
 */
const pluginsRegistry: PluginsRegistry = {
  logger: {
    provider: () => undefined,
  },
  metricsRecorder: {
    provider: () => undefined,
  },
};

/**
 * Registers a plugin under a namespace.
 * @param namespace the namespace to register the plugin
 * @param pluginSetting the setting object of the plugin to register
 *
 * @example
 * // example of a registration and usage of metricsRecorder plugin
 * registerPlugin('metricsRecorder', {
 *   provider: () => ({
 *     // record and console log all metrics
 *     record: (metric) => {
 *       console.log(metric);
 *     },
 *   }),
 * });
 */
export function registerPlugin<
  Namespace extends keyof PluginsRegistry,
  PluginSetting extends PluginsRegistry[Namespace]
>(namespace: Namespace, pluginSetting: PluginSetting): void {
  pluginsRegistry[namespace] = pluginSetting;
}

/**
 * Returns the plugin of the given namespace.
 * @param namespace the namespace of the plugin to retrieve
 * @returns the plugin matching the given namespace
 *
 * @example
 * // example of getting metricsRecorder plugin
 * const metricsRecorder = getPlugin('metricsRecorder');
 *
 * metricsRecorder?.record({
 *   metricName: 'test',
 *   metricValue: 123
 * });
 */
export function getPlugin<Namespace extends keyof PluginsRegistry>(
  namespace: Namespace
): ReturnType<PluginsRegistry[Namespace]['provider']> {
  const plugin = pluginsRegistry[namespace].provider() as ReturnType<
    PluginsRegistry[Namespace]['provider']
  >;

  return plugin;
}
