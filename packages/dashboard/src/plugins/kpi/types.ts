import type { StyledThreshold } from '@iot-app-kit/core';
import type { AssistantProperty } from '@iot-app-kit/react-components';
import type { QueryProperties } from '~/features/queries/queries';

export interface KPIProperties extends QueryProperties {
  title?: string | undefined;
  primaryFont?:
    | {
        fontSize?: number | undefined;
        fontColor?: string | undefined;
      }
    | undefined;
  secondaryFont?:
    | {
        fontSize?: number | undefined;
        fontColor?: string | undefined;
      }
    | undefined;
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
