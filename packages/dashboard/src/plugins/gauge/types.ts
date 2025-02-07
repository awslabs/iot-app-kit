import type { StyledThreshold } from '@iot-app-kit/core';
import type { AssistantProperty } from '@iot-app-kit/react-components';
import type { QueryProperties } from '~/features/queries/queries';

export interface GaugeProperties extends QueryProperties {
  title?: string;
  gaugeThickness?: number;
  showName?: boolean;
  showUnit?: boolean;
  fontSize?: number;
  labelFontSize?: number;
  unitFontSize?: number;
  yMin?: number;
  yMax?: number;
  thresholds?: StyledThreshold[];
  significantDigits?: number;
  assistant?: AssistantProperty;
}
