import type { ComparisonOperator, Viewport } from '@iot-app-kit/core';

export const COMPARISON_OPERATOR_TEXT_LABEL_MAP = {
  GTE: '>=',
  GT: '>',
  LTE: '<=',
  LT: '<',
  EQ: '=',
  CONTAINS: 'Contains',
} satisfies Record<ComparisonOperator, string>;

export const DEFAULT_VIEWPORT = { duration: '10m' } satisfies Viewport;
