import { Meta, StoryObj } from '@storybook/react';
import { KPI } from '@iot-app-kit/react-components';
import {
  mockTimeSeriesDataQuery,
  mockTimeSeriesDataQueryWithError,
  mockTimeSeriesDataQueryLoading,
} from '@iot-app-kit/testing-util';
import { mockSinWaveData } from '../../mockSinWaveData';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof KPI> = {
  title: 'Components/Kpi',
  component: KPI,
};

export default meta;

type Story = StoryObj<typeof KPI>;

export const Standard: Story = {
  args: {
    query: mockSinWaveData('1s'),
  },
};

export const Error: Story = {
  args: {
    query: mockTimeSeriesDataQueryWithError('some error message'),
  },
};

export const Loading: Story = {
  args: {
    query: mockTimeSeriesDataQueryLoading(),
  },
};

export const Empty: Story = {
  args: {
    query: mockTimeSeriesDataQuery([]),
  },
};
