import type { StatusSettings } from './types';
import { KPI } from '../kpi/kpi';
import type { Threshold, StyleSettingsMap, Viewport } from '@iot-app-kit/core';
import type { ComponentQuery } from '../../common/chartTypes';

export const Status = ({
  query,
  viewport: passedInViewport,
  styles,
  thresholds = [],
  aggregationType,
  settings,
  significantDigits,
}: {
  query: ComponentQuery;
  viewport?: Viewport;
  aggregationType?: string;
  thresholds?: Threshold[];
  styles?: StyleSettingsMap;
  settings?: Partial<StatusSettings>;
  significantDigits?: number;
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
    />
  );
};
