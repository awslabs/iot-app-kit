import {
  StyleSettingsMap,
  Threshold,
  Viewport,
  Primitive,
} from '@iot-app-kit/core';
import type { WidgetSettings } from '../../common/dataTypes';
import type { ComponentQuery } from '../../common/chartTypes';
import { PascalCaseStateName } from '../../hooks/useAlarms/transformers';
import { AlarmDataStatus } from '../../hooks/useAlarms';

export type GaugeProps = {
  size?: { width: number; height: number };
  query: ComponentQuery;
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
    alarmState?: PascalCaseStateName;
    alarmStatus?: AlarmDataStatus;
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
