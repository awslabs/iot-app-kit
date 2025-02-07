import { KPI } from '@iot-app-kit/react-components';
import {
  mockAlarmData,
  mockSinWaveData,
  mockSinWaveDataWithQuality,
  mockTimeSeriesDataQuery,
  mockTimeSeriesDataQueryLoading,
  mockTimeSeriesDataQueryWithError,
} from '@iot-app-kit/testing-util';
import { type Meta, type StoryObj } from '@storybook/react';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof KPI> = {
  title: 'Components/Kpi',
  component: KPI,
};

export default meta;

type Story = StoryObj<typeof KPI>;

export const Standard: Story = {
  render: (props) => (
    <div
      style={{ width: '300px', height: '200px', border: '1px solid lightgrey' }}
    >
      <KPI {...props} />
    </div>
  ),
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
    },
  },
};

export const Alarm: Story = {
  render: (props) => (
    <div
      style={{ width: '300px', height: '200px', border: '1px solid lightgrey' }}
    >
      <KPI {...props} />
    </div>
  ),
  args: {
    query: mockAlarmData(),
    settings: {
      showUnit: true,
      showName: true,
      showTimestamp: true,
      showAggregationAndResolution: true,
      fontSize: 30,
      secondaryFontSize: 12,
    },
  },
};

export const Error: Story = {
  render: (props) => (
    <div
      style={{ width: '300px', height: '200px', border: '1px solid lightgrey' }}
    >
      <KPI {...props} />
    </div>
  ),
  args: {
    query: mockTimeSeriesDataQueryWithError('some error message'),
  },
};

export const Loading: Story = {
  render: (props) => (
    <div
      style={{ width: '300px', height: '200px', border: '1px solid lightgrey' }}
    >
      <KPI {...props} />
    </div>
  ),
  args: {
    query: mockTimeSeriesDataQueryLoading(),
  },
};

export const Empty: Story = {
  render: (props) => (
    <div
      style={{ width: '300px', height: '200px', border: '1px solid lightgrey' }}
    >
      <KPI {...props} />
    </div>
  ),
  args: {
    query: mockTimeSeriesDataQuery([]),
  },
};

export const UncertainDataQuality: Story = {
  render: (props) => (
    <div
      style={{ width: '300px', height: '200px', border: '1px solid lightgrey' }}
    >
      <KPI {...props} />
    </div>
  ),
  args: {
    query: mockSinWaveDataWithQuality({
      frequency: '5s',
      quality: 'UNCERTAIN',
    }),
    settings: {
      showDataQuality: true,
    },
  },
};

export const BadDataQuality: Story = {
  render: (props) => (
    <div
      style={{ width: '300px', height: '200px', border: '1px solid lightgrey' }}
    >
      <KPI {...props} />
    </div>
  ),
  args: {
    query: mockSinWaveDataWithQuality({ frequency: '5s', quality: 'BAD' }),
    settings: {
      showDataQuality: true,
    },
  },
};

export const SignificantDigits: Story = {
  render: (props) => (
    <div
      style={{ width: '300px', height: '200px', border: '1px solid lightgrey' }}
    >
      <KPI {...props} />
    </div>
  ),
  args: {
    query: mockSinWaveDataWithQuality({ frequency: '5s', quality: 'BAD' }),
    settings: {
      showDataQuality: true,
    },
    significantDigits: 2,
  },
};
