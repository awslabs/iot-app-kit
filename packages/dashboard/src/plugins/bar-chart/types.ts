import type { AggregateType } from '@aws-sdk/client-iotsitewise';
import type { Threshold, ThresholdSettings } from '@iot-app-kit/core';
import type { QueryProperties } from '~/features/queries/queries';
import type { AggregateResolution } from '@iot-app-kit/source-iotsitewise';
import type { AxisSettings } from '~/features/widget-customization/settings';

export interface BarChartProperties extends QueryProperties {
  title?: string;
  thresholds?: Threshold[];
  thresholdSettings?: ThresholdSettings;
  axis?: AxisSettings;
  significantDigits?: number;
  resolution?: AggregateResolution;
  aggregationType?: AggregateType;
}
