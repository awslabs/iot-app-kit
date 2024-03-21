export type AnomalyEventDiagnostic = {
  name: string;
  value: number;
};

export type AnomalyEvent = {
  timestamp: string;
  prediction: number;
  prediction_reason: string;
  anomaly_score: number;
  diagnostics: AnomalyEventDiagnostic[];
};
