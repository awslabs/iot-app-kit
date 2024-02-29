import React from 'react';
import type {
  Threshold,
  TimeQuery,
  TimeSeriesData,
  TimeSeriesDataRequest,
  StyleSettingsMap,
  Viewport,
} from '@iot-app-kit/core';
import type { StatusSettings } from './types';
import { KPI } from '../kpi/kpi';

export const Status = ({
  query,
  viewport: passedInViewport,
  styles,
  thresholds = [],
  aggregationType,
  settings,
  significantDigits,
  refreshRate,
}: {
  query: TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>;
  viewport?: Viewport;
  aggregationType?: string;
  thresholds?: Threshold[];
  styles?: StyleSettingsMap;
  settings?: Partial<StatusSettings>;
  significantDigits?: number;
  refreshRate?: number;
}) => {
  return (
    <KPI
      query={query}
      viewport={passedInViewport}
      styles={styles}
      thresholds={thresholds}
      aggregationType={aggregationType}
      settings={settings}
      significantDigits={significantDigits}
      refreshRate={refreshRate}
    />
  );
};
