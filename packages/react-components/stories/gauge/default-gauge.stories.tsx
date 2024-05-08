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

export const DefaultGauge: ComponentStory<typeof Gauge> = ({ settings }) => {
  return (
    <div style={{ height: '500px', width: '500px', padding: '20px' }}>
      <Gauge
        viewport={{ duration: '5m' }}
        query={MOCK_TIME_SERIES_DATA_AGGREGATED_QUERY}
        settings={settings}
      />
    </div>
  );
};
