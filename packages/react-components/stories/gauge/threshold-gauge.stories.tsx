import React from 'react';
import { Gauge } from '../../src';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MOCK_TIME_SERIES_DATA_AGGREGATED_QUERY } from './mock-data';
import { DEFAULT_GAUGE_STYLES } from '../../src/components/gauge/constants';

export default {
  title: 'Widgets/Gauge',
  component: Gauge,
  argTypes: {
    settings: {
      control: { type: 'object' },
      defaultValue: DEFAULT_GAUGE_STYLES,
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Gauge>;

export const ThresholdGauge: ComponentStory<typeof Gauge> = ({ settings }) => {
  return (
    <div style={{ height: '500px', width: '500px', padding: '20px' }}>
      <Gauge
        thresholds={[
          {
            value: 30,
            id: 'abc',
            color: '#1e8103',
            comparisonOperator: 'GT',
          },
          {
            value: 70,
            id: 'xyz',
            color: '#ed7211',
            comparisonOperator: 'GT',
          },
          {
            value: 100,
            id: 'xyz',
            color: '#d13211',
            comparisonOperator: 'GT',
          },
        ]}
        viewport={{ duration: '5m' }}
        query={MOCK_TIME_SERIES_DATA_AGGREGATED_QUERY}
        settings={settings}
      />
    </div>
  );
};
