import React from 'react';
import { ScatterChart, WebglContext } from '@iot-app-kit/react-components';
import { Meta, StoryObj } from '@storybook/react';
import {
  mockTimeSeriesDataQuery,
  mockTimeSeriesDataQueryWithError,
  mockTimeSeriesDataQueryLoading,
} from '@iot-app-kit/testing-util';
import { mockSinWaveData } from '../../mockSinWaveData';

const meta: Meta<typeof ScatterChart> = {
  title: 'Components/ScatterChart',
  component: ScatterChart,
};

export default meta;

type Story = StoryObj<typeof ScatterChart>;

export const Standard: Story = {
  render: (props) => (
    <div style={{ height: '400px' }}>
      <ScatterChart {...props} />
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
