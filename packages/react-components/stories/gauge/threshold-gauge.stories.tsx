import React from 'react';
import { Gauge } from '../../src';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MOCK_TIME_SERIES_DATA_AGGREGATED_QUERY } from './mock-data';
import {
  DEFAULT_GAUGE_PROGRESS_COLOR,
  DEFAULT_GAUGE_STYLES,
} from '../../src/components/gauge/constants';
import { GaugeSettings } from '../../src/components/gauge/types';

const THRESHOLD_1 = {
  value: 30,
  id: 'abc',
  color: '#1e8103',
  comparisonOperator: 'GT',
};

const THRESHOLD_2 = {
  value: 70,
  id: 'xyz',
  color: '#ed7211',
  comparisonOperator: 'GT',
};

const THRESHOLD_3 = {
  value: 100,
  id: 'xyz',
  color: '#d13211',
  comparisonOperator: 'GT',
};

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
    significantDigits: { control: { type: 'number' }, defaultValue: 4 },
    thresholds: {
      control: { type: 'array' },
      defaultValue: [THRESHOLD_1, THRESHOLD_2, THRESHOLD_3],
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Gauge>;

export const ThresholdGauge: ComponentStory<typeof Gauge> = ({
  thresholds,
  significantDigits,
  ...settings
}) => {
  return (
    <div style={{ height: '500px', width: '600px', padding: '20px' }}>
      <Gauge
        viewport={{ duration: '5m' }}
        significantDigits={significantDigits}
        query={MOCK_TIME_SERIES_DATA_AGGREGATED_QUERY}
        settings={settings as GaugeSettings}
        thresholds={thresholds}
      />

      <div>
        Thresholds:
        {thresholds?.map(({ value, comparisonOperator }) => (
          <div>
            {comparisonOperator} {value}
          </div>
        ))}
      </div>
    </div>
  );
};
