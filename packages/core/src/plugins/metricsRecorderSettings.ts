import type { MetricsRecorder } from '../metricRecorder/metricsRecorder';

export type MetricsRecorderSettings = {
  provider: () => MetricsRecorder | undefined;
};
