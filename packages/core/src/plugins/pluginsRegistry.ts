import type { LoggerSettings } from './loggerSettings';
import type { MetricsRecorderSettings } from './metricsRecorderSettings';

/**
 * Internal object to hold all of the plugins.
 *
 * @emarks Not exported to encapsulate the registry
 */
const pluginsRegistry: {
  loggerSettings?: LoggerSettings;
  metricsRecorderSettings?: MetricsRecorderSettings;
} = {};

/**
 * Register a Logger for logging AppKit logs.
 * @param param0 settings for Logger
 * @alpha
 */
export const registerLogger = (settings: LoggerSettings) => {
  pluginsRegistry.loggerSettings = settings;
};

/**
 * Return the registered Logger.
 * @returns the registered Logger.
 * @alpha
 */
export const getLogger = () => pluginsRegistry.loggerSettings?.provider();

/**
 * Register a MetricsRecorder for recording AppKit metrics.
 * @param param0 settings for MetricsRecorder
 * @alpha
 */
export const registerMetricsRecorder = (settings: MetricsRecorderSettings) => {
  pluginsRegistry.metricsRecorderSettings = settings;
};

/**
 * Return the registered MetricsRecorder.
 * @returns the registered MetricsRecorder.
 * @alpha
 */
export const getMetricsRecorder = () => pluginsRegistry.metricsRecorderSettings?.provider();
