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
type Metric = {
  /**
   * Additional contexts to separate the metricName.
   */
  contexts?: Record<string, string>;
  metricName: string;
  metricValue: number;
  timestamp?: Date;
};

/**
 * MetricRequest represents {@link Metric} to record.
 */
type MetricsRequest = {
  metrics: Metric[];
};

/**
 * MetricClient gathers/emits {@link Metric}.
 */
export interface MetricClient {
  /**
   * Record metrics by {@link MetricClient}.
   * @param metricsRequest metrics to record by {@link MetricClient}
   * @returns nothing
   */
  record: (metricsRequest: MetricsRequest) => void;
}
