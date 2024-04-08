import { useCallback } from 'react';
import { getPreciseValue } from '../../../utils/getPreciseValue';
import { GaugeProps } from '../types';

export const useGaugeFormatterValue = ({
  unit,
  settings,
  significantDigits,
}: Pick<GaugeProps, 'settings' | 'significantDigits'> & {
  unit?: string;
}) => {
  const getFormatterValue = useCallback(
    (value: number) => {
      if (!value) return '-';
      return `{value|${getPreciseValue(value, significantDigits)}} ${
        settings?.showUnit && unit ? '{unit| ' + unit + '}' : ''
      }`;
    },
    [settings?.showUnit, significantDigits, unit]
  );
  return { getFormatterValue };
};
