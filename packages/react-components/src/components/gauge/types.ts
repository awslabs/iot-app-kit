import type { Primitive } from '@iot-app-kit/helpers';
import {
  type StyleSettingsMap,
  type Threshold,
  type Viewport,
} from '@iot-app-kit/core';
import type { WidgetSettings } from '../../common/dataTypes';
import { type AssistantProperty } from '../../common/assistantProps';
import type { ComponentQuery } from '../../common/chartTypes';
import type { AlarmContent } from '../alarm-components/alarm-content/types';
import { type AlarmDataStatus } from '../../hooks/useAlarms';

export type GaugeProps = {
  size?: { width: number; height: number };
  query: ComponentQuery;
  viewport?: Viewport;
  thresholds?: Threshold[];
  titleText?: string;
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
    alarmContent?: AlarmContent;
    assistant?: AssistantProperty;
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
