import { Table } from '@iot-app-kit/react-components';
import {
  mockAlarmData,
  mockTimeSeriesDataQuery,
} from '@iot-app-kit/testing-util';
import { DATA_TYPE } from '@iot-app-kit/core';
import { type Meta, type StoryObj } from '@storybook/react';

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
};

export default meta;

type Story = StoryObj<typeof Table>;

const VIEWPORT = { duration: '30s' };

const LATEST_VALUE = 123.2;
const DATA_STREAM = {
  id: 'wind_speed',
  name: 'wind_speed',
  dataType: DATA_TYPE.NUMBER,
  data: [{ x: new Date(2000, 0, 0).getTime(), y: LATEST_VALUE }],
  resolution: 0,
  unit: 'mph',
  isLoading: false,
};

export const Standard: Story = {
  render: (props) => (
    <Table
      viewport={VIEWPORT}
      items={[
        {
          rpm: 120.3,
          wind_speed: 50,
        },
        {
          rpm: 120.3,
          wind_speed: 50,
        },
      ]}
      columnDefinitions={[
        {
          key: 'rpm',
          header: 'RPM',
        },
        {
          key: 'wind_speed',
          header: 'Wind Speed',
        },
      ]}
      queries={props.queries}
    />
  ),
  args: {
    queries: [
      mockTimeSeriesDataQuery([
        {
          dataStreams: [DATA_STREAM],
          viewport: VIEWPORT,
          thresholds: [],
        },
      ]),
    ],
  },
};

export const Alarm: Story = {
  render: (props) => (
    <Table
      viewport={VIEWPORT}
      items={[]}
      columnDefinitions={[
        {
          key: 'property',
          header: 'Property',
          sortingField: 'property',
        },
        {
          key: 'value',
          header: 'Latest value',
          sortingField: 'value',
        },
        {
          key: 'unit',
          header: 'Unit',
          sortingField: 'unit',
        },
      ]}
      queries={props.queries}
    />
  ),
  args: {
    queries: [mockAlarmData()],
  },
};
