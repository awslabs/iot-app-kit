import {
  AnnotationValue,
  COMPARISON_OPERATOR,
  ComparisonOperator,
  StyledThreshold,
} from '@iot-app-kit/core';
import { COMPARATOR_MAP } from '../../../common/constants';

const comparisonOperatorToLowerYAxis = (
  comparisonOperator: ComparisonOperator,
  value: AnnotationValue
) => {
  switch (comparisonOperator) {
    case COMPARISON_OPERATOR.GT:
    case COMPARISON_OPERATOR.GTE:
    case COMPARISON_OPERATOR.EQ:
      return value;
    default:
      return undefined;
  }
};

const comparisonOperatorToUpperYAxis = (
  comparisonOperator: ComparisonOperator,
  value: AnnotationValue
) => {
  switch (comparisonOperator) {
    case COMPARISON_OPERATOR.LT:
    case COMPARISON_OPERATOR.LTE:
    case COMPARISON_OPERATOR.EQ:
      return value;
    default:
      return undefined;
  }
};

export const convertThresholds = (thresholds?: StyledThreshold[]) => {
  if (!thresholds || !thresholds.length) return {};
  return {
    markLine: {
      silent: true,
      symbol: 'none',
      lineStyle: 'dashOffset',
      animation: false,
      data: thresholds
        .filter((t) => typeof t.value === 'number')
        .map((t) => ({
          label: {
            formatter: `${COMPARATOR_MAP[t.comparisonOperator]} ${t.value}`,
            color: t.color,
          },
          lineStyle: {
            color: t.color,
            opacity: t.visible === false ? 0 : 1,
          },
          yAxis: t.value,
        })),
    },
    markArea: {
      silent: true,
      animation: false,
      data: thresholds
        .filter((t) => typeof t.value === 'number')
        .map(({ comparisonOperator, value, color, fill }) => [
          {
            yAxis: comparisonOperatorToLowerYAxis(comparisonOperator, value),
            itemStyle: {
              color: color,
              opacity: fill !== undefined ? 0.1 : 0,
            },
          },
          {
            yAxis: comparisonOperatorToUpperYAxis(comparisonOperator, value),
          },
        ]),
    },
  };
};
