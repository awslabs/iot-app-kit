import { HistoricalViewport } from '@iot-app-kit/core';
import { Data } from '../../../types';
import { AnomalyObjectStyles } from './input';

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

export type AnomalyDescription = AnomalyObjectStyles & {
  diagnostics: DiagnosticDescriptions;
  dataExtent?: HistoricalViewport;
};
