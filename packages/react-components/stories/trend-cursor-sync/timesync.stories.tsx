import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import TrendCursorSync from '../../src/components/trend-cursor-sync';
import { Chart } from '../../src';
import { MOCK_TIME_SERIES_DATA_QUERY, VIEWPORT } from '../chart/mock-data';

export default {
  title: 'Builder Components/TrendCursorSync/TrendCursorSync',
  component: TrendCursorSync,
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof TrendCursorSync>;

export const Main: ComponentStory<typeof TrendCursorSync> = () => (
  <TrendCursorSync groupId='no-group'>
    <Chart
      viewport={VIEWPORT}
      queries={[MOCK_TIME_SERIES_DATA_QUERY]}
      size={{ width: 800, height: 500 }}
      theme='light'
    />
  </TrendCursorSync>
);

export const MultipleTimeSyncs: ComponentStory<typeof TrendCursorSync> = () => (
  <div>
    <TrendCursorSync groupId='group2'>
      <Chart
        viewport={VIEWPORT}
        queries={[MOCK_TIME_SERIES_DATA_QUERY]}
        size={{ width: 800, height: 500 }}
        theme='light'
        id='chart1'
      />

      <Chart
        viewport={VIEWPORT}
        queries={[MOCK_TIME_SERIES_DATA_QUERY]}
        size={{ width: 800, height: 500 }}
        theme='light'
        id='chart2'
      />
    </TrendCursorSync>
  </div>
);
