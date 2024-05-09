import { Messages } from '../types';

export type AnomalyChartMessageKeys = 'anomaly-chart.error';

export const AnomalyChart: Messages<AnomalyChartMessageKeys> = {
  en: {
    'anomaly-chart.error': 'Error: failed to load anomaly results',
  },
} as const;
