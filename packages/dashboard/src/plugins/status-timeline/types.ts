import type { Threshold, ThresholdSettings } from '@iot-app-kit/core';
import type { AxisSettings } from '~/features/widget-customization/settings';
import type { QueryProperties } from '~/features/queries/queries';

export interface StatusTimelineProperties extends QueryProperties {
  title?: string;
  thresholds?: Threshold[];
  thresholdSettings?: ThresholdSettings;
  axis?: AxisSettings;
  significantDigits?: number;
}
