import type { ComparisonOperator } from '@iot-app-kit/core';
import { COMPARISON_OPERATOR } from '@iot-app-kit/core';

export const DEFAULT_THRESHOLD_COLOR = '#D0021B';
export const OPS_ALLOWED_WITH_STRING: ComparisonOperator[] = [
  COMPARISON_OPERATOR.EQ,
  COMPARISON_OPERATOR.CONTAINS,
];
