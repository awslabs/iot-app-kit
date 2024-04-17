// eslint-disable-next-line import/default
import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Gauge } from '@iot-app-kit/react-components';
import {
  mockTimeSeriesDataQueryWithError,
  mockTimeSeriesDataQueryLoading,
} from '@iot-app-kit/testing-util';
import { mockSinWaveDataWithQuality } from '../../mockSinWaveData';

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Gauge> = {
  title: 'Components/Gauge',
  component: Gauge,
};

export default meta;

type Story = StoryObj<typeof Gauge>;

export const Standard: Story = {
  render: (props) => (
    <div style={{ width: '900px', height: '500px' }}>
      <Gauge {...props} />
    </div>
  ),
  args: {
    query: mockSinWaveDataWithQuality({ frequency: '5s' }),
    settings: {
      gaugeThickness: 30,
      showUnit: true,
      showName: false,
      fontSize: 40,
      labelFontSize: 12,
      unitFontSize: 16,
      yMin: 0,
      yMax: 100,
    },
  },
};

export const StandardWithThresholds: Story = {
  render: (props) => (
    <div style={{ width: '900px', height: '500px' }}>
      <Gauge {...props} />
    </div>
  ),
  args: {
    query: mockSinWaveDataWithQuality({ frequency: '5s' }),
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
      labelFontSize: 12,
      unitFontSize: 16,
      yMin: 0,
      yMax: 100,
    },
  },
};

export const BadDataQuality: Story = {
  render: (props) => (
    <div style={{ width: '900px', height: '500px' }}>
      <Gauge {...props} />
    </div>
  ),
  args: {
    query: mockSinWaveDataWithQuality({ frequency: '5s', quality: 'BAD' }),
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
      labelFontSize: 12,
      unitFontSize: 16,
      yMin: 0,
      yMax: 100,
    },
  },
};

export const UncertainDataQuality: Story = {
  render: (props) => (
    <div style={{ width: '900px', height: '500px' }}>
      <Gauge {...props} />
    </div>
  ),
  args: {
    query: mockSinWaveDataWithQuality({
      frequency: '5s',
      quality: 'UNCERTAIN',
    }),
    settings: {
      gaugeThickness: 30,
      showUnit: true,
      showName: false,
      fontSize: 40,
      labelFontSize: 12,
      unitFontSize: 16,
      yMin: 0,
      yMax: 100,
    },
  },
};

export const Error: Story = {
  render: (props) => (
    <div style={{ width: '900px', height: '500px' }}>
      <Gauge {...props} />
    </div>
  ),
  args: {
    query: mockTimeSeriesDataQueryWithError('some error message'),
  },
};

export const Loading: Story = {
  render: (props) => (
    <div style={{ width: '900px', height: '500px' }}>
      <Gauge {...props} />
    </div>
  ),
  args: {
    query: mockTimeSeriesDataQueryLoading(),
  },
};
