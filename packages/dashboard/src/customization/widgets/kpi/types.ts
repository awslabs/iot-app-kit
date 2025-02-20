import type { StyledThreshold } from '@iot-app-kit/core';
import type { AssistantProperty } from '@iot-app-kit/react-components';
import type { SimpleFontSettings } from '~/customization/settings';
import type { QueryProperties } from '~/types/queries';
import type { KPIWidgetType } from './constants';

declare module '~/types/widgets' {
  interface DashboardWidgetRegistry {
    [KPIWidgetType]: KPIProperties;
  }
}

export interface KPIProperties extends QueryProperties {
  title?: string;
  primaryFont: SimpleFontSettings;
  secondaryFont: SimpleFontSettings;
  showAggregationAndResolution?: boolean;
  showValue?: boolean;
  showUnit?: boolean;
  showIcon?: boolean;
  showName?: boolean;
  showTimestamp?: boolean;
  showDataQuality?: boolean;
  thresholds?: StyledThreshold[];
  backgroundColor?: string;
  significantDigits?: number;
  assistant?: AssistantProperty;
}
