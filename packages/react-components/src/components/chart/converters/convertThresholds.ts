import { AnnotationValue, COMPARISON_OPERATOR, ComparisonOperator, Threshold } from '@iot-app-kit/core';
import { COMPARATOR_MAP } from '../../../common/constants';

const comparisonOperatorToLowerYAxis = (comparisonOperator: ComparisonOperator, value: AnnotationValue) => {
  switch (comparisonOperator) {
    case COMPARISON_OPERATOR.GT:
    case COMPARISON_OPERATOR.GTE:
    case COMPARISON_OPERATOR.EQ:
      return value;
    case COMPARISON_OPERATOR.LT:
    case COMPARISON_OPERATOR.LTE:
      return 0;
    default:
      return undefined;
  }
};

const comparisonOperatorToUpperYAxis = (comparisonOperator: ComparisonOperator, value: AnnotationValue) => {
  switch (comparisonOperator) {
    case COMPARISON_OPERATOR.LT:
    case COMPARISON_OPERATOR.LTE:
    case COMPARISON_OPERATOR.EQ:
      return value;
    default:
      return undefined;
  }
};

export const convertThresholds = (thresholds?: Threshold[]) => {
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
          },
          lineStyle: {
            color: t.color,
          },
          yAxis: t.value,
        })),
    },
    markArea: {
      silent: true,
      animation: false,
      data: thresholds
        .filter((t) => typeof t.value === 'number')
        .map(({ comparisonOperator, value, color }) => [
          {
            yAxis: comparisonOperatorToLowerYAxis(comparisonOperator, value),
            itemStyle: {
              color: color,
              opacity: 0.1,
            },
          },
          {
            yAxis: comparisonOperatorToUpperYAxis(comparisonOperator, value),
          },
        ]),
    },
  };
};
