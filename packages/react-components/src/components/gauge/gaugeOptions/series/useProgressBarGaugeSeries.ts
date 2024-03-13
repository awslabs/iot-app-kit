import { useMemo } from 'react';
import { Primitive } from '@iot-app-kit/core';
import { GaugeProps } from '../../types';
import { DEFAULT_GAUGE_PROGRESS_COLOR } from '../../constants';
import { useGaugeThresholds } from '../../hooks/useGaugeThresholds';
import { useGaugeFormatterValue } from '../../hooks/useGaugeFormatterValue';

/**
 * Generates a progress bar gauge series based on the provided settings and data.
 *
 * @param {Pick<GaugeProps, 'settings' | 'thresholds' | 'significantDigits'> & {
 *   gaugeValue?: Primitive;
 *   name?: string;
 *   unit?: string;
 *   hasThresholds: boolean;
 * }} params - The parameters for generating the progress bar gauge series.
 * @return {object} - The generated progress bar gauge series.
 */
export const useProgressBarGaugeSeries = ({
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
        color: hasThresholds ? gaugeThresholds : DEFAULT_GAUGE_PROGRESS_COLOR,
      },
      progress: {
        width: settings?.gaugeThickness,
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
      title: {
        show: settings?.showName,
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
    settings?.gaugeThickness,
    settings?.fontSize,
    settings?.unitFontSize,
    settings?.showName,
    hasThresholds,
    gaugeThresholds,
    getFormatterValue,
    gaugeValue,
    name,
  ]);
};
