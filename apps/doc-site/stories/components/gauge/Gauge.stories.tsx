// eslint-disable-next-line import/default
import { Gauge } from '@iot-app-kit/react-components';
import {
  mockAlarmData,
  mockSinWaveDataWithQuality,
  mockTimeSeriesDataQueryWithError,
  mockTimeSeriesDataQueryLoading,
} from '@iot-app-kit/testing-util';
import { type Meta, type StoryObj } from '@storybook/react';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Gauge> = {
  title: 'Components/Gauge',
  component: Gauge,
};

export default meta;

type Story = StoryObj<typeof Gauge>;

export const Standard: Story = {
  render: (props) => (
    <div style={{ width: '300px', height: '300px' }}>
      <Gauge {...props} />
    </div>
  ),
  args: {
    query: mockSinWaveDataWithQuality({ frequency: '5s', positiveOnly: true }),
    settings: {
      gaugeThickness: 30,
      showUnit: true,
      showName: false,
      fontSize: 40,
      labelFontSize: 16,
      unitFontSize: 16,
      yMin: 0,
      yMax: 100,
    },
  },
};

export const StandardWithThresholds: Story = {
  render: (props) => {
    const standardProps = { ...props };
    delete standardProps.thresholds;
    return (
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div>
          <h3>Standard</h3>
          <div
            style={{
              width: '400px',
              height: '300px',
              border: '1px solid lightgrey',
            }}
          >
            <Gauge {...standardProps} />
          </div>
        </div>
        <div>
          <h3>With Thresholds</h3>
          <div
            style={{
              width: '400px',
              height: '300px',
              border: '1px solid lightgrey',
            }}
          >
            <Gauge {...props} />
          </div>
        </div>
      </div>
    );
  },
  args: {
    query: mockSinWaveDataWithQuality({ frequency: '5s', positiveOnly: true }),
    thresholds: [
      {
        value: 30,
        id: 'abc',
        color: '#1e8103',
        comparisonOperator: 'GT',
      },
      {
        value: 70,
        id: 'xyz',
        color: '#ed7211',
        comparisonOperator: 'GT',
      },
      {
        value: 100,
        id: 'xyz',
        color: '#d13211',
        comparisonOperator: 'GT',
      },
    ],
    settings: {
      gaugeThickness: 30,
      showUnit: true,
      showName: false,
      fontSize: 40,
      labelFontSize: 16,
      unitFontSize: 16,
      yMin: 0,
      yMax: 100,
    },
  },
};

export const BadDataQuality: Story = {
  render: (props) => (
    <div
      style={{
        width: '400px',
        height: '300px',
        border: '1px solid lightgrey',
        margin: '0 auto',
      }}
    >
      <Gauge {...props} />
    </div>
  ),
  args: {
    query: mockSinWaveDataWithQuality({
      frequency: '5s',
      quality: 'BAD',
      positiveOnly: true,
    }),
    thresholds: [
      {
        value: 30,
        id: 'abc',
        color: '#1e8103',
        comparisonOperator: 'GT',
      },
      {
        value: 70,
        id: 'xyz',
        color: '#ed7211',
        comparisonOperator: 'GT',
      },
      {
        value: 100,
        id: 'xyz',
        color: '#d13211',
        comparisonOperator: 'GT',
      },
    ],
    settings: {
      gaugeThickness: 30,
      showUnit: true,
      showName: false,
      fontSize: 40,
      labelFontSize: 16,
      unitFontSize: 16,
      yMin: 0,
      yMax: 100,
    },
  },
};

export const UncertainDataQuality: Story = {
  render: (props) => (
    <div
      style={{
        width: '400px',
        height: '300px',
        border: '1px solid lightgrey',
        margin: '0 auto',
      }}
    >
      <Gauge {...props} />
    </div>
  ),
  args: {
    query: mockSinWaveDataWithQuality({
      frequency: '5s',
      quality: 'UNCERTAIN',
      positiveOnly: true,
    }),
    settings: {
      gaugeThickness: 30,
      showUnit: true,
      showName: false,
      fontSize: 40,
      labelFontSize: 16,
      unitFontSize: 16,
      yMin: 0,
      yMax: 100,
    },
  },
};

export const SignificantDigits: Story = {
  render: (props) => (
    <div
      style={{
        width: '300px',
        height: '300px',
        border: '1px solid lightgrey',
        margin: '0 auto',
      }}
    >
      <Gauge {...props} />
    </div>
  ),
  args: {
    query: mockSinWaveDataWithQuality({ frequency: '5s', positiveOnly: true }),
    significantDigits: 2,
  },
};

export const Loading: Story = {
  render: (props) => (
    <div
      style={{
        width: '400px',
        height: '300px',
        border: '1px solid lightgrey',
        margin: '0 auto',
      }}
    >
      <Gauge {...props} />
    </div>
  ),
  args: {
    query: mockTimeSeriesDataQueryLoading(),
  },
};

export const Error: Story = {
  render: (props) => (
    <div
      style={{
        width: '400px',
        height: '300px',
        border: '1px solid lightgrey',
        margin: '0 auto',
      }}
    >
      <Gauge {...props} />
    </div>
  ),
  args: {
    query: mockTimeSeriesDataQueryWithError('some error message'),
  },
};

export const Alarm: Story = {
  render: (props) => (
    <div
      style={{
        width: '400px',
        height: '300px',
        border: '1px solid lightgrey',
        margin: '0 auto',
      }}
    >
      <Gauge {...props} />
    </div>
  ),
  args: {
    query: mockAlarmData(),
    settings: {
      gaugeThickness: 30,
      showUnit: true,
      showName: false,
      fontSize: 40,
      labelFontSize: 16,
      unitFontSize: 16,
      yMin: -100,
      yMax: 100,
    },
  },
};
