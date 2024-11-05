import { StatusTimeline, WebglContext } from '@iot-app-kit/react-components';
import {
  mockAlarmData,
  mockTimeSeriesDataQuery,
  mockTimeSeriesDataQueryWithError,
  mockTimeSeriesDataQueryLoading,
  mockTimeSeriesStringLiveStream,
} from '@iot-app-kit/testing-util';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof StatusTimeline> = {
  title: 'Components/StatusTimeline',
  component: StatusTimeline,
};

export default meta;

type Story = StoryObj<typeof StatusTimeline>;

export const Standard: Story = {
  render: (props) => (
    <div style={{ height: '300px', width: '400px' }}>
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

export const Alarm: Story = {
  ...Standard,
  args: {
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
