import React from 'react';
import { Status } from '@iot-app-kit/react-components';
import { Meta, StoryObj } from '@storybook/react';
import {
  mockTimeSeriesDataQuery,
  mockTimeSeriesDataQueryWithError,
  mockTimeSeriesDataQueryLoading,
} from '@iot-app-kit/testing-util';
import { mockSinWaveData } from '../../mockSinWaveData';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Status> = {
  title: 'Components/Status',
  component: Status,
};

export default meta;

type Story = StoryObj<typeof Status>;

export const Standard: Story = {
  render: (props) => (
    <div style={{ width: '250px', height: '250px' }}>
      <Status {...props} />
    </div>
  ),
  args: {
    query: mockSinWaveData('1s'),
  },
};

export const Error: Story = {
  ...Standard,
  args: {
    query: mockTimeSeriesDataQueryWithError('some error message'),
  },
};

export const Loading: Story = {
  ...Standard,
  args: {
    query: mockTimeSeriesDataQueryLoading(),
  },
};

export const Empty: Story = {
  ...Standard,
  args: {
    query: mockTimeSeriesDataQuery([]),
  },
};
