export interface IMetricRecorder {
  recordClick(context: string, detail?: any): void;
}
