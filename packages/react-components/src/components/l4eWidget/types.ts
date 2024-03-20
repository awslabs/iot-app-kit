export type AnomalyDiagnostic = {
  name: string;
  value: number;
};

export type AnomalyValue = {
  anomalyScore: number;
  predictionReason: string;
  diagnostics: AnomalyDiagnostic[];
  timestamp: number;
};

export type AnomalyResult = {
  quality: string;
  value: AnomalyValue;
};
