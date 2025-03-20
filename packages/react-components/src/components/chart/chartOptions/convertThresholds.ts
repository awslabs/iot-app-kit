import type {
  AnnotationValue,
  ComparisonOperator,
  StyledThreshold,
} from '@iot-app-kit/core';
import { COMPARISON_OPERATOR_TEXT_LABEL_MAP } from '@iot-app-kit/component-core';

const comparisonOperatorToLowerYAxis = (
  comparisonOperator: ComparisonOperator,
  value: AnnotationValue
) => {
  switch (comparisonOperator) {
    case 'GT':
    case 'GTE':
    case 'EQ':
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
    case 'LT':
    case 'LTE':
    case 'EQ':
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
            formatter: `${
              COMPARISON_OPERATOR_TEXT_LABEL_MAP[t.comparisonOperator]
            } ${t.value}`,
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
