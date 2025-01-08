import type { Primitive } from '@iot-app-kit/helpers';
import { type Threshold } from '@iot-app-kit/core';

export const thresholdsToColor = ({
  gaugeValue,
  thresholds,
  defaultColor,
}: {
  gaugeValue?: Primitive;
  thresholds: Threshold[];
  defaultColor?: string;
}) => {
  if (!gaugeValue) return;

  let gaugeColor = defaultColor;

  thresholds.forEach(({ comparisonOperator, value, color }) => {
    switch (comparisonOperator) {
      case 'LT':
        if (gaugeValue < value) gaugeColor = color;
        break;
      case 'LTE':
        if (gaugeValue <= value) gaugeColor = color;
        break;
      case 'GT':
        if (gaugeValue > value) gaugeColor = color;
        break;
      case 'GTE':
        if (gaugeValue >= value) gaugeColor = color;
        break;
      case 'EQ':
        if (gaugeValue == value) gaugeColor = color;
        break;
    }
  });

  return gaugeColor;
};
