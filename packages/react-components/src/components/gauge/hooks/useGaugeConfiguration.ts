import { useEffect } from 'react';
import { Primitive } from '@iot-app-kit/core';
import {
  DEFAULT_GAUGE_SETTINGS,
  DEFAULT_GAUGE_SETTINGS_WITH_THRESHOLDS,
} from '../constants';
import { ChartRef } from '../../../hooks/useECharts';
import { GaugeProps } from '../types';
import { useEmptyGaugeSeries } from '../gaugeOptions/series/useEmptyGaugeSeries';
import { useProgressBarGaugeSeries } from '../gaugeOptions/series/useProgressBarGaugeSeries';
import { useThresholdOutsideArcSeries } from '../gaugeOptions/series/useThresholdOutsideArcSeries';

type GaugeConfigurationOptions = Pick<
  GaugeProps,
  'thresholds' | 'settings' | 'significantDigits'
> & {
  gaugeValue?: Primitive;
  name?: string;
  unit?: string;
};

export const useGaugeConfiguration = (
  chartRef: ChartRef,
  {
    thresholds,
    gaugeValue,
    name,
    settings,
    unit,
    significantDigits,
  }: GaugeConfigurationOptions
) => {
  const hasThresholds = Boolean(thresholds?.length ?? 0 > 0);

  useEffect(() => {
    const gauge = chartRef.current;
    if (!gauge) return;

    // Set default Gauge options
    gauge?.setOption(
      !hasThresholds
        ? DEFAULT_GAUGE_SETTINGS
        : DEFAULT_GAUGE_SETTINGS_WITH_THRESHOLDS
    );
  }, [chartRef, hasThresholds]);

  const greySeries = useEmptyGaugeSeries({
    settings,
  });

  const progressSeries = useProgressBarGaugeSeries({
    hasThresholds,
    name,
    gaugeValue,
    unit,
    significantDigits,
    thresholds,
    settings,
  });

  const thresholdSeries = useThresholdOutsideArcSeries({
    hasThresholds,
    name,
    gaugeValue,
    unit,
    significantDigits,
    thresholds,
    settings,
  });

  useEffect(() => {
    // Update chart
    const gauge = chartRef.current;
    gauge?.setOption({
      series: [
        greySeries,
        progressSeries,
        ...(hasThresholds ? [thresholdSeries] : []),
      ],
    });
  }, [chartRef, hasThresholds, greySeries, progressSeries, thresholdSeries]);
};
