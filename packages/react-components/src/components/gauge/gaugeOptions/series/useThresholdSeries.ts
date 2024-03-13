import { useMemo } from 'react';
import { Primitive } from '@iot-app-kit/core';
import { GaugeProps } from '../../types';
import { useGaugeThresholds } from '../../hooks/useGaugeThresholds';
import { useGaugeFormatterValue } from '../../hooks/useGaugeFormatterValue';

export const useThresholdSeries = ({
  settings,
  thresholds,
  significantDigits,
  gaugeValue,
  name,
  unit,
  hasThresholds,
}: Pick<GaugeProps, 'settings' | 'thresholds' | 'significantDigits'> & {
  gaugeValue?: Primitive;
  name?: string;
  unit?: string;
  hasThresholds: boolean;
}) => {
  const gaugeThresholds = useGaugeThresholds({
    hasThresholds,
    settings,
    thresholds,
  });
  const { getFormatterValue } = useGaugeFormatterValue({
    significantDigits,
    unit,
    settings,
  });

  return useMemo(() => {
    return {
      min: settings?.yMin,
      max: settings?.yMax,
      itemStyle: {
        color: gaugeThresholds,
      },
      axisLabel: {
        fontSize: settings?.labelFontSize,
      },
      axisLine: {
        lineStyle: {
          color: gaugeThresholds,
        },
      },
      detail: {
        formatter: getFormatterValue,
        rich: {
          value: {
            fontSize: settings?.fontSize,
          },
          unit: {
            fontSize: settings?.unitFontSize,
          },
        },
      },
      data: [
        {
          value: gaugeValue,
          name,
        },
      ],
    };
  }, [
    settings?.yMin,
    settings?.yMax,
    settings?.labelFontSize,
    settings?.fontSize,
    settings?.unitFontSize,
    gaugeValue,
    name,
    gaugeThresholds,
    getFormatterValue,
  ]);
};
