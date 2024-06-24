import { Meta, StoryObj } from '@storybook/react';
import { KPI } from '@iot-app-kit/react-components';
import {
  mockTimeSeriesDataQuery,
  mockTimeSeriesDataQueryWithError,
  mockTimeSeriesDataQueryLoading,
} from '@iot-app-kit/testing-util';
import { mockSinWaveData } from '../../mockSinWaveData';
import React from 'react';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof KPI> = {
  title: 'Components/Kpi',
  component: KPI,
};

export default meta;

type Story = StoryObj<typeof KPI>;

export const Standard: Story = {
  render: (props) => (
    <div style={{ width: '200px', height: '150px' }}>
      <KPI {...props} />
    </div>
  ),
  args: {
    query: mockSinWaveData('5s'),
  },
};

export const Error: Story = {
  ...Standard,
  args: {
    query: mockTimeSeriesDataQueryWithError('Error! Failed to authenticate user.'),
  },
};

export const Loading: Story = {
  ...Standard,
  args: {
    query: mockTimeSeriesDataQueryLoading(),
  },
};

export const Empty: Story = {
  args: {
    query: mockTimeSeriesDataQuery([]),
  },
};
