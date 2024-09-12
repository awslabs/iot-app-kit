import React from 'react';
import { Gauge } from '../../src';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MOCK_TIME_SERIES_DATA_AGGREGATED_QUERY } from './mock-data';
import {
  DEFAULT_GAUGE_PROGRESS_COLOR,
  DEFAULT_GAUGE_STYLES,
} from '../../src/components/gauge/constants';
import { GaugeSettings } from '../../src/components/gauge/types';

export default {
  title: 'Widgets/Gauge',
  component: Gauge,
  argTypes: {
    gaugeThickness: {
      control: { type: 'number' },
      defaultValue: DEFAULT_GAUGE_STYLES.gaugeThickness,
    },
    color: {
      control: { type: 'color' },
      defaultValue: DEFAULT_GAUGE_PROGRESS_COLOR,
    },
    showName: {
      control: { type: 'boolean' },
      defaultValue: DEFAULT_GAUGE_STYLES.showName,
    },
    showUnit: {
      control: { type: 'boolean' },
      defaultValue: DEFAULT_GAUGE_STYLES.showUnit,
    },
    fontSize: {
      control: { type: 'number' },
      defaultValue: DEFAULT_GAUGE_STYLES.fontSize,
    },
    unitFontSize: {
      control: { type: 'number' },
      defaultValue: DEFAULT_GAUGE_STYLES.unitFontSize,
    },
    yMin: {
      control: { type: 'number' },
      defaultValue: DEFAULT_GAUGE_STYLES.yMin,
    },
    yMax: {
      control: { type: 'number' },
      defaultValue: DEFAULT_GAUGE_STYLES.yMax,
    },
    size: {
      control: { type: 'object' },
      defaultValue: { width: 500, height: 500 },
    },
    significantDigits: { control: { type: 'number' }, defaultValue: 4 },
  },
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Gauge>;

export const DefaultGauge: ComponentStory<typeof Gauge> = ({
  size,
  significantDigits,
  ...settings
}) => {
  return (
    <div style={{ height: '500px', width: '500px', padding: '20px' }}>
      <Gauge
        viewport={{ duration: '5m' }}
        size={size}
        significantDigits={significantDigits}
        query={MOCK_TIME_SERIES_DATA_AGGREGATED_QUERY}
        settings={settings as GaugeSettings}
        titleText='Average Speed'
      />
      <Gauge
        viewport={{ duration: '5m' }}
        size={size}
        significantDigits={significantDigits}
        query={MOCK_TIME_SERIES_DATA_AGGREGATED_QUERY}
        settings={settings as GaugeSettings}
        titleText='Average Speed'
      />
    </div>
  );
};
