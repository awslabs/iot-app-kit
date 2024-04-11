import { useEffect, useMemo } from 'react';
import { Primitive } from '@iot-app-kit/core';
import {
  DEFAULT_GAUGE_PROGRESS_SETTINGS,
  DEFAULT_GAUGE_PROGRESS_SETTINGS_WITH_THRESHOLDS,
  DEFAULT_GAUGE_SETTINGS,
} from '../constants';
import { ChartRef } from '../../../hooks/useECharts';
import { GaugeProps } from '../types';
import { useEmptyGaugeSeries } from '../gaugeOptions/series/useEmptyGaugeSeries';
import { useProgressBarGaugeSeries } from '../gaugeOptions/series/useProgressBarGaugeSeries';
import { useThresholdOutsideArcSeries } from '../gaugeOptions/series/useThresholdOutsideArcSeries';

export type GaugeConfigurationOptions = Pick<
  GaugeProps,
  'thresholds' | 'settings' | 'significantDigits'
> & {
  gaugeValue?: Primitive;
  name?: string;
  unit?: string;
  error?: string;
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
    error,
  }: GaugeConfigurationOptions
) => {
  const hasThresholds = Boolean(thresholds?.length ?? 0 > 0);

  const defaultSettings = useMemo(() => {
    if (error) return DEFAULT_GAUGE_SETTINGS;

    return hasThresholds
      ? DEFAULT_GAUGE_PROGRESS_SETTINGS_WITH_THRESHOLDS
      : DEFAULT_GAUGE_PROGRESS_SETTINGS;
  }, [error, hasThresholds]);

  useEffect(() => {
    const gauge = chartRef.current;
    if (!gauge) return;

    // Set default Gauge options
    gauge.setOption(defaultSettings);
  }, [chartRef, defaultSettings]);

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
