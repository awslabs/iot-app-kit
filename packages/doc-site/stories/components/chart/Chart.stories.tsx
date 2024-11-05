import React from 'react';
import { Chart } from '@iot-app-kit/react-components';
import {
  mockAlarmData,
  mockSinWaveData,
  mockTimeSeriesDataQuery,
  mockTimeSeriesDataQueryWithError,
  mockTimeSeriesDataQueryLoading,
} from '@iot-app-kit/testing-util';
import { Meta, StoryObj } from '@storybook/react';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Chart> = {
  title: 'Components/Chart',
  component: Chart,
};

export default meta;

type Story = StoryObj<typeof Chart>;

export const Standard: Story = {
  render: (props) => (
    <div style={{ height: '500px', width: '800px' }}>
      <Chart {...{ ...props, legend: {}, size: { height: 500, width: 900 } }} />
    </div>
  ),
  args: {
    queries: [mockSinWaveData()],
    viewport: { duration: '30s' },
  },
};

export const Alarm: Story = {
  render: (props) => (
    <div style={{ height: '500px', width: '800px' }}>
      <Chart {...{
        ...props, 
        legend: {
          visible: true,
          position: 'bottom',
          visibleContent: { visibility: true, latestAlarmStateValue: true },
          height: '100px',
        }, 
        size: { height: 500, width: 900 },
        significantDigits: 2
      }} />
    </div>
  ),
  args: {
    queries: [mockAlarmData(1000)],
    viewport: { duration: '30s' },
  },
};

export const StandardWithLegend: Story = {
  render: (props) => (
    <div style={{ height: '500px', width: '800px' }}>
      <Chart {...{
        ...props, 
        legend: {
          visible: true,
          position: 'bottom',
          visibleContent: { maxValue: true },
          height: '100px',
        }, 
        size: { height: 500, width: 900 } 
      }} />
    </div>
  ),
  args: {
    queries: [mockSinWaveData()],
    viewport: { duration: '30s' },
  },
};

export const Error: Story = {
  ...Standard,
  args: {
    queries: [mockTimeSeriesDataQueryWithError('some error message')],
  },
};

export const Empty: Story = {
  ...Standard,
  args: {
    queries: [mockTimeSeriesDataQuery([])],
  },
};

export const Loading: Story = {
  ...Standard,
  args: {
    queries: [mockTimeSeriesDataQueryLoading()],
  },
};
