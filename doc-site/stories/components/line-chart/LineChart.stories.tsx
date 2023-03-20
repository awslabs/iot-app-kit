import React from 'react';
import { LineChart, WebglContext } from '@iot-app-kit/react-components';
import { Meta, StoryObj } from '@storybook/react';
import {
  mockTimeSeriesDataQuery,
  mockTimeSeriesDataQueryWithError,
  mockTimeSeriesDataQueryLoading,
} from '@iot-app-kit/testing-util';
import { mockSinWaveData } from '../../mockSinWaveData';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof LineChart> = {
  title: 'Components/Line chart',
  component: LineChart,
};

export default meta;

type Story = StoryObj<typeof LineChart>;

export const Standard: Story = {
  render: (props) => (
    <div style={{ height: '400px' }}>
      <LineChart {...props} />
      <WebglContext />
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
