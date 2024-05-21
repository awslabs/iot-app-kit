import { useMemo } from 'react';
import { Primitive } from '@iot-app-kit/core';
import { GaugeProps } from '../../types';
import { useGaugeThresholds } from '../../hooks/useGaugeThresholds';
import { useGaugeFormatterValue } from '../../hooks/useGaugeFormatterValue';

/**
 * Generates a outside arc gauge series based on the provided settings and data.
 *
 * @param {Pick<GaugeProps, 'settings' | 'thresholds' | 'significantDigits'> & {
 *    gaugeValue?: Primitive;
 *    name?: string;
 *    unit?: string;
 *    hasThresholds: boolean;
 * }} - The parameters for generating the outside arc gauge series.
 * - indicating whether thresholds are present
 *
 * @return {Object} - The generated outside arc gauge series.
 */

export const useThresholdOutsideArcSeries = ({
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
    settings?.fontSize,
    settings?.unitFontSize,
    gaugeValue,
    name,
    gaugeThresholds,
    getFormatterValue,
  ]);
};
