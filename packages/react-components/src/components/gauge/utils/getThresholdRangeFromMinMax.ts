import { ComparisonOperator, ThresholdValue } from '@iot-app-kit/core';

export const getThresholdRangeFromMinMax = ({
  value,
  comparisonOperator,
  min = 0,
  max = 100,
}: {
  value: ThresholdValue;
  comparisonOperator: ComparisonOperator;
  min?: number;
  max?: number;
}) => {
  if (typeof value !== 'number') return [0, 0];

  const range = max - min;

  switch (comparisonOperator) {
    case 'GT':
    case 'GTE':
      // if the GT/GTE threshold is out of range (beyond the y-max), don't display it
      if (value >= max) return [1, 1];
      return [(value - min) / range, undefined];
    case 'LT':
    case 'LTE':
      // if the LT/LTE threshold is past the y-max, threshold should have a range 0%-100%
      if (value >= max) return [undefined, 1];
      // if the LT/LTE threshold is out of range (beyond the y-min), don't display it
      if (value <= min) return [0, 0];
      return [undefined, (value - min) / range];
    default:
      // any other comparisonOperator
      return [0, 0];
  }
};
