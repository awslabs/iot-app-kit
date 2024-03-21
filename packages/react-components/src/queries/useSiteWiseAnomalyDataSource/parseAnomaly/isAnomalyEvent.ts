import { isDiagnostics } from './isDiagnostic';
import { AnomalyEvent } from './types';

export const isAnomalyEvent = (event: object): event is AnomalyEvent => {
  const isCorrectShape =
    'timestamp' in event &&
    'prediction' in event &&
    'prediction_reason' in event &&
    'anomaly_score' in event &&
    'diagnostics' in event;

  if (!isCorrectShape) return false;

  const {
    timestamp,
    prediction,
    prediction_reason,
    anomaly_score,
    diagnostics,
  } = event;

  const isCorrectTypes =
    typeof timestamp === 'string' &&
    typeof prediction === 'number' &&
    typeof prediction_reason === 'string' &&
    typeof anomaly_score === 'number' &&
    isDiagnostics(diagnostics);

  if (!isCorrectTypes) return false;

  return true;
};
