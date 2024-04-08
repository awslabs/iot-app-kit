import { HistoricalViewport } from '@iot-app-kit/core';
import type { FixedLengthArray } from 'type-fest';
import { AnomalyObjectDataSource } from '../../data/transformers/anomaly/object/datasource';

type AnomalyWidgetDataSources = AnomalyObjectDataSource;
export type AnomalyWidgetOptions = {
  title?: string;
  mode?: 'light' | 'dark';
  decimalPlaces?: number;
  datasources: FixedLengthArray<AnomalyWidgetDataSources, 1>;
  viewport: HistoricalViewport;
  tooltipSort?: 'value' | 'alphabetical';
};
