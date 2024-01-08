import { TooltipComponentOption } from 'echarts';
import { isNumeric, round } from '@iot-app-kit/core-util';

import { ChartOptions } from '../types';
import { DEFAULT_TOOLTIP } from '../eChartsConstants';

const formatValue =
  (significantDigits: ChartOptions['significantDigits']) =>
  (value: string | number | Date) =>
    value instanceof Date
      ? value.toISOString()
      : isNumeric(value)
      ? `${round(value, significantDigits)}`
      : value;

export const convertTooltip = (
  significantDigits: ChartOptions['significantDigits']
): TooltipComponentOption => ({
  ...DEFAULT_TOOLTIP,
  valueFormatter: (value) => {
    if (Array.isArray(value))
      return value.map(formatValue(significantDigits)).join(', ');
    return formatValue(significantDigits)(value);
  },
});
