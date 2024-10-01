// eslint-disable-next-line import/default
import React from 'react';
import { useECharts, useLoadableEChart } from '../../hooks/useECharts';
import { GaugeBaseProperties } from './types';
import { useGaugeConfiguration } from './hooks/useGaugeConfiguration';
import { useResizableGauge } from './hooks/useResizableGauge';
import { GaugeErrorText } from './gaugeErrorText';
import { GaugeText } from './gaugeText';
import './gauge.css';
import { Title } from '../../common/title';
import { thresholdsToColor } from './utils/thresholdsToColor';

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
  size,
  propertyPoint,
  thresholds = [],
  settings,
  unit,
  name,
  isLoading,
  significantDigits,
  error,
  titleText,
  alarmState,
  ...options
}) => {
  const gaugeValue = propertyPoint?.y;
  const quality = propertyPoint?.quality;

  // Setup instance of echarts
  const { ref, chartRef } = useECharts(options?.theme);

  // apply loading animation to echart instance
  useLoadableEChart(chartRef, isLoading);

  useGaugeConfiguration(
    chartRef,
    {
      isLoading,
      thresholds,
      gaugeValue,
      name,
      settings,
      unit,
      significantDigits,
      error,
    },
    options.theme
  );

  // resize on widget resize
  useResizableGauge(chartRef, size);

  return (
    <div
      className='gauge-base-container gauge-base'
      data-testid={
        !error ? 'gauge-base-component' : 'gauge-base-component-error'
      }
      style={{
        width: size?.width,
        height: size?.height,
      }}
    >
      <Title text={titleText} />
      <div
        ref={ref}
        className='gauge-base'
        data-testid='gauge-name-and-unit'
        style={{
          width: size?.width,
          height: size?.height,
        }}
      />
      <GaugeErrorText error={error} />
      {!isLoading && (
        <GaugeText
          valueColor={thresholdsToColor({
            gaugeValue,
            thresholds,
            defaultColor: settings?.color,
          })}
          unit={unit}
          settings={settings}
          name={name}
          error={error}
          quality={quality}
          titleText={titleText}
          value={gaugeValue}
          alarmState={alarmState}
          significantDigits={significantDigits}
        />
      )}
    </div>
  );
};
