import { COMPARISON_OPERATOR } from '@iot-app-kit/core';

export const getComparisonOperators = (
  { supportsContains }: { supportsContains: boolean } = {
    supportsContains: false,
  }
) => [
  { label: '>', value: COMPARISON_OPERATOR.GT },
  { label: '<', value: COMPARISON_OPERATOR.LT },
  { label: '=', value: COMPARISON_OPERATOR.EQ },
  { label: '>=', value: COMPARISON_OPERATOR.GTE },
  { label: '<=', value: COMPARISON_OPERATOR.LTE },
  {
    label: 'Contains',
    value: COMPARISON_OPERATOR.CONTAINS,
    disabled: !supportsContains,
  },
];

export type ComparisonOperators = ReturnType<typeof getComparisonOperators>;
