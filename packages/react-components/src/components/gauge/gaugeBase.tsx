// eslint-disable-next-line import/default
import React from 'react';
import { useECharts, useLoadableEChart } from '../../hooks/useECharts';
import { GaugeBaseProperties } from './types';
import { useGaugeConfiguration } from './hooks/useGaugeConfiguration';
import { GaugeErrorText } from './gaugeErrorText';
import { GaugeDataQualityText } from './gaugeDataQualityText';
import './gauge.css';

/**
 * Renders a base gauge component.
 *
 * @param {GaugeBaseProperties} propertyPoint - The property point object.
 * @param {Array} thresholds - The thresholds array.
 * @param {Object} settings - The settings object.
 * @param {string} unit - The unit string.
 * @param {string} name - The name string.
 * @param {boolean} isLoading - The isLoading boolean.
 * @param {number} significantDigits - The significantDigits number.
 * @param {Object} options - The options object.
 * @return {ReactElement} The rendered gauge component.
 */
export const GaugeBase: React.FC<GaugeBaseProperties> = ({
  propertyPoint,
  thresholds = [],
  settings,
  unit,
  name,
  isLoading,
  significantDigits,
  error,
  ...options
}) => {
  const gaugeValue = propertyPoint?.y;
  const quality = propertyPoint?.quality;

  // Setup instance of echarts
  const { ref, chartRef } = useECharts(options?.theme);

  // apply loading animation to echart instance
  useLoadableEChart(chartRef, isLoading);

  useGaugeConfiguration(chartRef, {
    isLoading,
    thresholds,
    gaugeValue,
    name,
    settings,
    unit,
    significantDigits,
    error,
  });

  return (
    <div
      className='gauge-base-container gauge-base'
      data-testid={
        !error ? 'gauge-base-component' : 'gauge-base-component-error'
      }
    >
      <div ref={ref} className='gauge-base' />
      <GaugeErrorText error={error} />
      <GaugeDataQualityText
        error={error}
        quality={quality}
        showName={settings?.showName}
      />
    </div>
  );
};
