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
  isLoading?: boolean;
};

export const useGaugeConfiguration = (
  chartRef: ChartRef,
  {
    isLoading,
    thresholds,
    gaugeValue,
    name,
    settings,
    unit,
    significantDigits,
    error,
  }: GaugeConfigurationOptions
) => {
  const hasThresholds = Boolean(
    // hasThresholds filters EQ and CONTAINS operators since they are not supported as gauge thresholds
    thresholds?.filter(
      (t) =>
        t.comparisonOperator !== 'EQ' && t.comparisonOperator !== 'CONTAINS'
    )?.length ?? 0 > 0
  );

  const defaultSettings = useMemo(() => {
    if (error || isLoading) return DEFAULT_GAUGE_SETTINGS;

    return hasThresholds
      ? DEFAULT_GAUGE_PROGRESS_SETTINGS_WITH_THRESHOLDS
      : DEFAULT_GAUGE_PROGRESS_SETTINGS;
  }, [error, hasThresholds, isLoading]);

  useEffect(() => {
    const gauge = chartRef.current;
    if (!gauge) return;

    // Set default Gauge options
    gauge.setOption(defaultSettings);
  }, [chartRef, defaultSettings]);

  const emptySeries = useEmptyGaugeSeries({
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
    !(isLoading || error)
      ? gauge?.setOption({
          series: [
            emptySeries,
            progressSeries,
            ...(hasThresholds ? [thresholdSeries] : []),
          ],
        })
      : null;
  }, [
    chartRef,
    hasThresholds,
    emptySeries,
    progressSeries,
    thresholdSeries,
    isLoading,
    error,
  ]);
};
