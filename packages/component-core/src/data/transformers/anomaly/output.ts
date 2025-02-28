import { type HistoricalViewport } from '@iot-app-kit/core';
import { type Data } from '../../types';
import { type AnomalyStyles } from './input';

export type DiagnosticData = {
  [key: `diagnostic_${string}`]: number;
};

export type AnomalyDataShape = {
  timestamp: number;
} & DiagnosticData;

export type AnomalyData = Data<AnomalyDataShape>;

export type DiagnosticDescription = {
  id: string;
  name: string;
};

export type DiagnosticDescriptions = DiagnosticDescription[];

export type AnomalyDescription = AnomalyStyles & {
  diagnostics: DiagnosticDescriptions;
  dataExtent?: HistoricalViewport;
};
