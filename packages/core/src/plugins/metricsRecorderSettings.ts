import type { MetricsRecorder } from '../metric-recorder/metricsRecorder.interface';

export type MetricsRecorderSettings = { provider: () => MetricsRecorder };
