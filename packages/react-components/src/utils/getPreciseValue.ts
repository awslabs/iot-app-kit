import type { Primitive } from '@iot-app-kit/helpers';
import { isNumeric, round } from '@iot-app-kit/core-util';

export const getPreciseValue = (value: Primitive, significantDigits = 4) =>
  isNumeric(value) ? `${round(value, significantDigits)}` : value?.toString();
