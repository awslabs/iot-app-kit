import type { ThresholdSettings } from '@iot-app-kit/core';
import type {
  AxisSettings,
  ThresholdWithId,
} from '~/features/widget-customization/settings';
import type { QueryProperties } from '~/features/queries/queries';

export interface StatusTimelineProperties extends QueryProperties {
  title?: string;
  thresholds?: ThresholdWithId[];
  thresholdSettings?: ThresholdSettings;
  axis?: AxisSettings;
  significantDigits?: number;
}
