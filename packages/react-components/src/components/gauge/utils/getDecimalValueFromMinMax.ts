import { ThresholdValue } from '@iot-app-kit/core';

export const getDecimalValueFromMinMax = ({
  value,
  min = 0,
  max = 100,
}: {
  value: ThresholdValue;
  min?: number;
  max?: number;
}) => {
  if (typeof value !== 'number') return 0;
  if (value <= min) return 0;
  if (value >= max) return 1;
  return (value - min) / (max - min);
};
