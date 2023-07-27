import React from 'react';
import type { ComponentMeta, ComponentStory } from '@storybook/react';
import { MOCK_TIME_SERIES_DATA_QUERY, MOCK_TIME_SERIES_DATA_AGGREGATED_QUERY, VIEWPORT, MOCK_TIME_SERIES_DATA_QUERY_2 } from './mock-data';
// Should be part of the public API, i.e. exported from src
import { LineChart, ScatterChart, BarChart, StatusTimeline, WebglContext, TimeSync, useViewport } from '../../src';
import Chart from '../../src/components/chart';

const ViewportConsumer = () => {
  const { viewport, setViewport } = useViewport();

  const chooseRandomViewport = () => {
    setViewport({
      start: new Date(new Date(1900, 0, 0).getTime() + 1000000000000 * Math.random()),
      end: new Date(new Date(2000, 0, 0).getTime() + 1000000000000 * Math.random()),
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

export const BaseChartExample: ComponentStory<typeof Chart> = () => {
  return (
    <div id='story-container' style={{ width: '100vw', height: '100vh' }}>
      <Chart
        viewport={VIEWPORT}
        queries={[MOCK_TIME_SERIES_DATA_QUERY]}
        size={{ width: 800, height: 500 }}
        theme='light'
      />
    </div>
  );
};

export const MultiYAxisChartExample: ComponentStory<typeof Chart> = () => {
  return (
    <div id='story-container' style={{ width: '100vw', height: '100vh' }}>
      {/* <h1>single y axis for all trends</h1> */}
      {/* <h1>stream 0 with a custom y axis</h1> */}
      {/* <h1>stream 0 and 1 with a custom y axis</h1> */}
      {/* <h1>all streams with a custom y axis</h1> */}
      <Chart
        viewport={VIEWPORT}
        queries={[MOCK_TIME_SERIES_DATA_QUERY_2]}
        size={{ width: 800, height: 500 }}
        significantDigits={8}
        // styleSettings={{
        //   'stream-0': {
        //     yAxis: {
        //       // yMin: 0,
        //       // yMax: 500,
        //     },
        //   },
        //   'stream-1': {
        //     yAxis: {
        //       // yMin: 0,
        //       // yMax: 500,
        //     },
        //   },
        //   'stream-2': {
        //     yAxis: {
        //       // yMin: 0,
        //       // yMax: 500,
        //     },
        //   }
        // }}
        theme='light'
      />
    </div>
  );
};
