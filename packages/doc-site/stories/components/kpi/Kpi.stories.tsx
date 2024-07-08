import { Meta, StoryObj } from '@storybook/react';
import { KPI } from '@iot-app-kit/react-components';
import {
  mockTimeSeriesDataQuery,
  mockTimeSeriesDataQueryWithError,
  mockTimeSeriesDataQueryLoading,
} from '@iot-app-kit/testing-util';
import { mockSinWaveData, mockSinWaveDataWithQuality } from '../../mockSinWaveData';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof KPI> = {
  title: 'Components/Kpi',
  component: KPI,
};

export default meta;

type Story = StoryObj<typeof KPI>;

export const Standard: Story = {
  args: {
    query: mockSinWaveData('5s'),
    settings: {
      showUnit: true,
      showName: true,
      showTimestamp: true,
      showAggregationAndResolution: true,
      fontSize: 30,
      secondaryFontSize: 12,
      backgroundColor: '#ffffff',
    }
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

export const UncertainDataQuality: Story = {
  args: {
    query: mockSinWaveDataWithQuality({
      frequency: '5s',
      quality: 'UNCERTAIN',
    }),
  },
};

export const BadDataQuality: Story = {
  args: {
    query: mockSinWaveDataWithQuality({ frequency: '5s', quality: 'BAD' }),
  },
};
