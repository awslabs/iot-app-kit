import type { MetricsRecorder } from '../metricRecorder/metricsRecorder.interface';

export type MetricsRecorderSettings = {
  provider: () => MetricsRecorder | undefined;
};
