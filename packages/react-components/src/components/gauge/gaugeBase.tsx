// eslint-disable-next-line import/default
import React from 'react';
import { useECharts } from '../../hooks/useECharts';
import { GaugeBaseProperties } from './types';
import { useGaugeConfiguration } from './hooks/useGaugeConfiguration';
import { useResizableGauge } from './hooks/useResizableGauge';
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
  alarmContent,
  assistant,
  alarmStatus,
  ...options
}) => {
  const gaugeValue = propertyPoint?.y;
  const quality = propertyPoint?.quality;

  // Setup instance of echarts
  const { ref, chartRef } = useECharts(options?.theme);

  useGaugeConfiguration(
    chartRef,
    {
      thresholds: thresholds,
      gaugeValue: gaugeValue,
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
      <GaugeText
        valueColor={thresholdsToColor({
          gaugeValue,
          thresholds,
          defaultColor: settings?.color,
        })}
        isLoading={isLoading}
        alarmStatus={alarmStatus}
        unit={unit}
        error={error}
        settings={settings}
        name={name}
        quality={quality}
        value={gaugeValue}
        significantDigits={significantDigits}
        titleText={titleText}
        alarmContent={alarmContent}
        assistant={assistant}
      />
    </div>
  );
};
