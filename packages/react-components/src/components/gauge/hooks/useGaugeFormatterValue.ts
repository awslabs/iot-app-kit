import { useCallback } from 'react';
import { getPreciseValue } from '../../../utils/getPreciseValue';
import { type GaugeProps } from '../types';

export const useGaugeFormatterValue = ({
  unit,
  settings,
  decimalPlaces,
}: Pick<GaugeProps, 'settings' | 'decimalPlaces'> & {
  unit?: string;
}) => {
  const getFormatterValue = useCallback(
    (value: number) => {
      if (!value) return '-';
      return `{value|${getPreciseValue(value, significantDigits)}} ${
        settings?.showUnit && unit ? '{unit| ' + unit + '}' : ''
      }`.trim();
    },
    [settings?.showUnit, significantDigits, unit]
  );
  return { getFormatterValue };
};
