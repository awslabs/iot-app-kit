import { BarChart, WebglContext } from '@iot-app-kit/react-components';
import { Meta, StoryObj } from '@storybook/react';
import {
  mockTimeSeriesDataQuery,
  mockTimeSeriesDataQueryWithError,
  mockTimeSeriesDataQueryLoading,
} from '@iot-app-kit/testing-util';
import { mockSinWaveDataAggregated } from '../../mockSinWaveData';

const meta: Meta<typeof BarChart> = {
  title: 'Components/BarChart',
  component: BarChart,
};

export default meta;

type Story = StoryObj<typeof BarChart>;

export const Standard: Story = {
  render: (props) => (
    <div style={{ height: '400px' }}>
      <BarChart {...props} />
      <WebglContext />
    </div>
  ),
  args: {
    queries: [mockSinWaveDataAggregated()],
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
