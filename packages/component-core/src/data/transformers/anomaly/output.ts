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

export interface DiagnosticDescription {
  id: string;
  name: string;
}

export type DiagnosticDescriptions = DiagnosticDescription[];

export interface AnomalyDescription extends AnomalyStyles {
  diagnostics: DiagnosticDescriptions;
  dataExtent?: HistoricalViewport;
}
