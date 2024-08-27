import {
  StyleSettingsMap,
  Threshold,
  Viewport,
  Primitive,
  TimeSeriesDataQuery,
} from '@iot-app-kit/core';
import type { WidgetSettings } from '../../common/dataTypes';
import { AssistantProperty } from '../../common/assistantProps';

export type GaugeProps = {
  size?: { width: number; height: number };
  query: TimeSeriesDataQuery;
  viewport?: Viewport;
  thresholds?: Threshold[];
  styles?: StyleSettingsMap;
  settings?: GaugeSettings;
  significantDigits?: number;
  theme?: string;
  assistant?: AssistantProperty;
};

export type GaugeBaseProperties = WidgetSettings &
  Pick<
    GaugeProps,
    'thresholds' | 'settings' | 'significantDigits' | 'theme' | 'size'
  > & {
    isLoading?: boolean;
  };
export type GaugeSettings = {
  gaugeThickness?: number;
  color?: string; // hex string
  showName?: boolean;
  showUnit?: boolean;
  fontSize?: number; // pixels
  labelFontSize?: number; // pixels
  unitFontSize?: number; // pixels
  yMin?: number;
  yMax?: number;
};

export type GaugeConfigurationOptions = Pick<
  GaugeProps,
  'thresholds' | 'settings' | 'significantDigits'
> & {
  gaugeValue?: Primitive;
  name?: string;
  unit?: string;
  error?: string;
  isLoading?: boolean;
};
