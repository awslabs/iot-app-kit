import { Messages } from '../types';

export type AnomalyWidgetMessageKeys = 'anomaly-widget.error';

export const AnomalyWidget: Messages<AnomalyWidgetMessageKeys> = {
  en: {
    'anomaly-widget.error': 'Error: failed to load anomaly results',
  },
} as const;
