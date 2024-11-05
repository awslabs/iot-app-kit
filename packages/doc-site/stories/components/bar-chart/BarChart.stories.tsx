import { BarChart, WebglContext } from '@iot-app-kit/react-components';
import {
  mockAlarmData,
  mockSinWaveDataAggregated,
  mockTimeSeriesDataQuery,
  mockTimeSeriesDataQueryWithError,
  mockTimeSeriesDataQueryLoading,
} from '@iot-app-kit/testing-util';
import { Meta, StoryObj } from '@storybook/react';

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

export const Alarm: Story = {
  ...Standard,
  args: {
    ...Standard.args,
    queries: [mockAlarmData()],
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
