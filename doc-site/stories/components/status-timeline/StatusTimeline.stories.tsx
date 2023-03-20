import React from 'react';
import { StatusTimeline, WebglContext } from '@iot-app-kit/react-components';
import { Meta, StoryObj } from '@storybook/react';
import {
  mockTimeSeriesDataQuery,
  mockTimeSeriesDataQueryWithError,
  mockTimeSeriesDataQueryLoading,
} from '@iot-app-kit/testing-util';
import { mockTimeSeriesStringLiveStream } from '../../mockSinWaveData';

const meta: Meta<typeof StatusTimeline> = {
  title: 'Components/StatusTimeline',
  component: StatusTimeline,
};

export default meta;

type Story = StoryObj<typeof StatusTimeline>;

export const Standard: Story = {
  render: (props) => (
    <div style={{ height: '400px' }}>
      <StatusTimeline {...props} />
      <WebglContext />
    </div>
  ),
  args: {
    queries: [mockTimeSeriesStringLiveStream()],
    thresholds: [
      {
        color: '#d13212',
        value: 'ERROR',
        comparisonOperator: 'EQ',
      },
      {
        color: '#ff9900',
        value: 'WARNING',
        comparisonOperator: 'EQ',
      },
      {
        color: '#1d8102',
        value: 'OK',
        comparisonOperator: 'EQ',
      },
    ],
    viewport: { duration: '1m' },
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
