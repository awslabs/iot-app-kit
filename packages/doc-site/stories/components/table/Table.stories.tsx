import { Meta, StoryObj } from '@storybook/react';
import { Table, useAssistant } from '@iot-app-kit/react-components';
import { mockTimeSeriesDataQuery } from '@iot-app-kit/testing-util';
import React from 'react';
import { DATA_TYPE } from '@iot-app-kit/core';

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
};

export default meta;

type Story = StoryObj<typeof Table>;

const VIEWPORT = { duration: '5s' };

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
          wind_speed: 50
        },
        {
          rpm: 120.3,
          wind_speed: 50
        }
      ]}
    
      columnDefinitions={[
        {
          key: 'rpm',
          header: 'RPM'
        },
        {
          key: 'wind_speed',
          header: 'Wind Speed'
        }
      ]}
    
      queries={props.queries}
    /> 
  ),
  args: {
    queries: [mockTimeSeriesDataQuery([
      {
        dataStreams: [DATA_STREAM],
        viewport: VIEWPORT,
        thresholds: [],
      },
    ])],
  },
};
