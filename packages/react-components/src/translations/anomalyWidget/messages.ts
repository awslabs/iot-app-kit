import { Messages } from '../types';

export type AnomalyChartMessageKeys =
  | 'anomaly-chart.error'
  | 'anomaly-chart.empty'
  | 'anomaly-chart.empty-subtitle';

export const AnomalyChart: Messages<AnomalyChartMessageKeys> = {
  en: {
    'anomaly-chart.error': "The data couldn't be fetched. Try again later.",
    'anomaly-chart.empty': 'No data or query is available',
    'anomaly-chart.empty-subtitle': 'There is no data or query available',
  },
} as const;
