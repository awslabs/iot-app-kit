import React from 'react';
import { Chart } from '@iot-app-kit/react-components';
import { Meta, StoryObj } from '@storybook/react';
import {
  mockTimeSeriesDataQuery,
  mockTimeSeriesDataQueryWithError,
  mockTimeSeriesDataQueryLoading,
} from '@iot-app-kit/testing-util';
import { mockSinWaveData } from '../../mockSinWaveData';

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
