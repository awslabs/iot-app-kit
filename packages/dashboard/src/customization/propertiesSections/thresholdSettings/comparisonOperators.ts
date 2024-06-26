import { COMPARISON_OPERATOR } from '@iot-app-kit/core';

export const getComparisonOperators = (
  {
    supportsContains,
    supportsEquals,
  }: { supportsContains: boolean; supportsEquals: boolean } = {
    supportsContains: false,
    supportsEquals: true,
  }
) => [
  { label: '>', value: COMPARISON_OPERATOR.GT },
  { label: '<', value: COMPARISON_OPERATOR.LT },
  { label: '=', value: COMPARISON_OPERATOR.EQ, disabled: !supportsEquals },
  { label: '>=', value: COMPARISON_OPERATOR.GTE },
  { label: '<=', value: COMPARISON_OPERATOR.LTE },
  {
    label: 'Contains',
    value: COMPARISON_OPERATOR.CONTAINS,
    disabled: !supportsContains,
  },
];

export type ComparisonOperators = ReturnType<typeof getComparisonOperators>;
