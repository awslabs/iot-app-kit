import { StyledThreshold } from '@iot-app-kit/core';
import type { WidgetSettings } from '../../common/dataTypes';
import { AlarmContent } from '../alarm-state/types';
import { AssistantProperty } from '../../common/assistantProps';

export type KPIBaseProperties = WidgetSettings & {
  settings?: Partial<KPISettings>;
  propertyThreshold?: StyledThreshold;
  timeZone?: string;
  alarmContent?: AlarmContent;
  assistant?: AssistantProperty;
};

export type KPISettings = {
  showTimestamp: boolean;
  showAggregationAndResolution: boolean;
  showName: boolean;
  showUnit: boolean;
  showDataQuality: boolean;
  fontSize: number; // pixels
  secondaryFontSize: number; // pixels
  backgroundColor: string; // hex string
  showAssetName: boolean;
  /** @deprecated */
  aggregationFontSize: number; // pixels
  /** @deprecated */
  color: string; // hex string
  /** @deprecated */
  showIcon: boolean;
};
