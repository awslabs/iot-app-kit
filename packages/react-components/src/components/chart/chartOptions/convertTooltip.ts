import { TooltipComponentOption } from 'echarts';
import { isNumeric, round } from '@iot-app-kit/core-util';

import { ChartOptions } from '../types';
import { useMemo } from 'react';

const formatValue =
  (significantDigits: ChartOptions['significantDigits']) =>
  (value: string | number | Date) =>
    value instanceof Date
      ? value.toISOString()
      : isNumeric(value)
      ? `${round(value, significantDigits)}`
      : value;

export const useTooltip = (
  significantDigits: ChartOptions['significantDigits']
) => {
  return useMemo<TooltipComponentOption>(
    () => ({
      valueFormatter: (value) => {
        if (Array.isArray(value))
          return value.map(formatValue(significantDigits)).join(', ');
        return formatValue(significantDigits)(value);
      },
    }),
    [significantDigits]
  );
};
