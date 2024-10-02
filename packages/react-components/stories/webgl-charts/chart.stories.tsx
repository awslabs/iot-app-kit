import React from 'react';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import {
  MOCK_TIME_SERIES_DATA_QUERY,
  MOCK_TIME_SERIES_DATA_AGGREGATED_QUERY,
  VIEWPORT,
} from '../chart/mock-data';
import { MOCK_TIME_SERIES_DATA_QUERY as MOCK_TIME_SERIES_DATA_QUERY_ONE } from '../kpi/kpi-mock-data';
// Should be part of the public API, i.e. exported from src
import {
  LineChart,
  ScatterChart,
  BarChart,
  StatusTimeline,
  WebglContext,
  TimeSync,
  useViewport,
} from '../../src';

const ViewportConsumer = () => {
  const { viewport, setViewport } = useViewport();

  const chooseRandomViewport = () => {
    setViewport({
      start: new Date(
        new Date(1900, 0, 0).getTime() + 1000000000000 * Math.random()
      ),
      end: new Date(
        new Date(2000, 0, 0).getTime() + 1000000000000 * Math.random()
      ),
    });
  };

  return (
    <div>
      Current viewport:
      <code>{JSON.stringify(viewport)}</code>
      <button onClick={chooseRandomViewport}>Choose random viewport</button>
    </div>
  );
};

export default {
  title: 'Widgets/WebGL Charts',
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

export const MultipleBarChartExample: ComponentStory<typeof LineChart> = () => {
  return (
    <div id='story-container' style={{ width: '500px', height: '300px' }}>
      <TimeSync>
        <BarChart queries={[MOCK_TIME_SERIES_DATA_AGGREGATED_QUERY]} />
        <LineChart queries={[MOCK_TIME_SERIES_DATA_QUERY]} />
        <ViewportConsumer />
      </TimeSync>
      <WebglContext />
    </div>
  );
};

export const ScatterChartExample: ComponentStory<typeof ScatterChart> = () => {
  return (
    <div id='story-container' style={{ width: '500px', height: '300px' }}>
      <ScatterChart
        viewport={VIEWPORT}
        queries={[MOCK_TIME_SERIES_DATA_QUERY]}
      />
      <WebglContext />
    </div>
  );
};

export const BarChartExample: ComponentStory<typeof BarChart> = () => {
  return (
    <div
      style={{
        width: '500px',
        height: '320px',
        backgroundColor: 'grey',
        padding: '20px',
      }}
    >
      <div
        id='story-container'
        style={{ width: '500px', height: '300px', backgroundColor: 'white' }}
      >
        <BarChart
          viewport={VIEWPORT}
          queries={[MOCK_TIME_SERIES_DATA_AGGREGATED_QUERY]}
          titleText='Bar Chart Title'
          chartSize={{ height: 300, width: 500 }}
        />
        <WebglContext />
      </div>
    </div>
  );
};

export const StatusTimelineExample: ComponentStory<
  typeof StatusTimeline
> = () => {
  return (
    <div id='story-container' style={{ width: '500px', height: '300px' }}>
      <StatusTimeline
        viewport={VIEWPORT}
        queries={[MOCK_TIME_SERIES_DATA_QUERY]}
        titleText='Status Timeline Title'
      />
      <StatusTimeline
        viewport={VIEWPORT}
        queries={[MOCK_TIME_SERIES_DATA_QUERY_ONE]}
        titleText='Status Timeline Title'
      />
      <WebglContext />
    </div>
  );
};
