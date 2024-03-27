// eslint-disable-next-line import/default
import React from 'react';
import { useECharts, useLoadableEChart } from '../../hooks/useECharts';
import { GaugeBaseProperties } from './types';
import { useGaugeConfiguration } from './hooks/useGaugeConfiguration';

export const GaugeBase: React.FC<GaugeBaseProperties> = ({
  propertyPoint,
  thresholds = [],
  settings,
  unit,
  name,
  isLoading,
  significantDigits,
  ...options
}) => {
  const gaugeValue = propertyPoint?.y;

  // Setup instance of echarts
  const { ref, chartRef } = useECharts(options?.theme);

  // apply loading animation to echart instance
  useLoadableEChart(chartRef, isLoading);

  useGaugeConfiguration(chartRef, {
    thresholds,
    gaugeValue,
    name,
    settings,
    unit,
    significantDigits,
  });

  return <div ref={ref} style={{ width: '100%', height: '100%' }} />;
};
