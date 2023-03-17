import React from 'react';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { MOCK_TIME_SERIES_DATA_QUERY, MOCK_TIME_SERIES_DATA_AGGREGATED_QUERY, VIEWPORT } from './mock-data';
// Should be part of the public API, i.e. exported from src
import { LineChart, ScatterChart, BarChart, StatusTimeline, WebglContext } from '../../src';

export default {
  title: 'Widgets/Charts',
  component: LineChart,
  argTypes: {
    name: { control: { type: 'text' }, defaultValue: 'Windmill' },
  },
  parameters: {
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof LineChart>;

export const LineChartExample: ComponentStory<typeof LineChart> = () => {
  return (
    <div id='story-container' style={{ width: '500px', height: '300px' }}>
      <LineChart viewport={VIEWPORT} queries={[MOCK_TIME_SERIES_DATA_QUERY]} />
      <WebglContext />
    </div>
  );
};

export const ScatterChartExample: ComponentStory<typeof ScatterChart> = () => {
  return (
    <div id='story-container' style={{ width: '500px', height: '300px' }}>
      <ScatterChart viewport={VIEWPORT} queries={[MOCK_TIME_SERIES_DATA_QUERY]} />
      <WebglContext />
    </div>
  );
};

export const BarChartExample: ComponentStory<typeof BarChart> = () => {
  return (
    <div id='story-container' style={{ width: '500px', height: '300px' }}>
      <BarChart viewport={VIEWPORT} queries={[MOCK_TIME_SERIES_DATA_AGGREGATED_QUERY]} />
      <WebglContext />
    </div>
  );
};

export const StatusTimelineExample: ComponentStory<typeof StatusTimeline> = () => {
  return (
    <div id='story-container' style={{ width: '500px', height: '300px' }}>
      <StatusTimeline viewport={VIEWPORT} queries={[MOCK_TIME_SERIES_DATA_QUERY]} />
      <WebglContext />
    </div>
  );
};
