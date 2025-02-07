/**
 * Metric represents a single event datum to record.
 *
 * @example
 * // Example 1, metrics with same namespace:
 *
 * const metric1 = {
 *   contexts: {
 *     component: "Dashboard",
 *   },
 *   metricName: "latency",
 *   metricValue: 1,
 * };
 *
 * const metric2 = {
 *   contexts: {
 *     component: "Dashboard",
 *   },
 *   metricName: "latency",
 *   metricValue: 2,
 * };
 *
 * // Example 2, metrics with different namespace due to different contexts:
 *
 * const metric1 = {
 *   contexts: {
 *     component: "Dashboard",
 *   },
 *   metricName: "latency",
 *   metricValue: 1,
 * };
 *
 * const metric2 = {
 *   contexts: {
 *     component: "IotResourceExplorer",
 *   },
 *   metricName: "latency",
 *   metricValue: 2,
 * };
 */
export interface Metric {
  /**
   * Additional contexts to separate the metricName.
   */
  contexts?: Record<string, string>;
  metricName: string;
  metricValue: number;
  timestamp?: Date;
}

/**
 * MetricsRecorder gathers/emits {@link Metric}.
 */
export interface MetricsRecorder {
  /**
   * Record metric by {@link MetricsRecorder}.
   * @param metric metric to record
   */
  record: (metric: Metric) => void;
}
