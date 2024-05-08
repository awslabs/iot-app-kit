import React from 'react';
import { KPI } from '../../src';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { MOCK_TIME_SERIES_DATA_QUERY, VIEWPORT } from './kpi-thresholds';

export default {
  title: 'Widgets/KPI',
  component: KPI,
  argTypes: {
    settings: {
      color: { control: { type: 'color' } },
      significantDigits: { control: { type: 'number' } },
      showName: { control: { type: 'boolean' } },
      showTimestamp: { control: { type: 'boolean' } },
      showUnit: { control: { type: 'boolean' } },
      showAggregationAndResolution: { control: { type: 'boolean' } },
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof KPI>;

export const DefaultKPI: ComponentStory<typeof KPI> = ({ settings }) => {
  return (
    <div style={{ background: 'grey' }}>
      <div style={{ height: '200px', width: '250px', padding: '20px' }}>
        <KPI
          viewport={VIEWPORT}
          query={MOCK_TIME_SERIES_DATA_QUERY}
          settings={settings}
        />
      </div>
    </div>
  );
};
