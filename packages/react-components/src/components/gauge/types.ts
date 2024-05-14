import {
  StyleSettingsMap,
  Threshold,
  TimeQuery,
  TimeSeriesData,
  TimeSeriesDataRequest,
  Viewport,
} from '@iot-app-kit/core';
import type { WidgetSettings } from '../../common/dataTypes';

export type GaugeProps = {
  size?: { width: number; height: number };
  query: TimeQuery<TimeSeriesData[], TimeSeriesDataRequest>;
  viewport?: Viewport;
  thresholds?: Threshold[];
  styles?: StyleSettingsMap;
  settings?: GaugeSettings;
  significantDigits?: number;
  theme?: string;
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
  showName?: boolean;
  showUnit?: boolean;
  fontSize?: number; // pixels
  labelFontSize?: number; // pixels
  unitFontSize?: number; // pixels
  yMin?: number;
  yMax?: number;
};
