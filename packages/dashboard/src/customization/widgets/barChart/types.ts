import type { AggregateType } from '@aws-sdk/client-iotsitewise';
import type { ThresholdSettings } from '@iot-app-kit/core';
import type { QueryProperties } from '~/types/queries';
import type { AxisSettings, ThresholdWithId } from '../../settings';
import type { BarChartWidgetType } from './constants';

declare module '~/types/widgets' {
  interface DashboardWidgetRegistry {
    [BarChartWidgetType]: BarChartProperties;
  }
}

export interface BarChartProperties extends QueryProperties {
  title?: string;
  thresholds?: ThresholdWithId[];
  thresholdSettings?: ThresholdSettings;
  axis?: AxisSettings;
  significantDigits?: number;
  resolution?: string;
  aggregationType?: AggregateType;
}
