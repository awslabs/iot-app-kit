import React from 'react';
import { render } from '@testing-library/react';
import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';
import { mockTimeSeriesDataQuery } from '@iot-app-kit/testing-util';
import { DataStream } from '@iot-app-kit/core';
import { Table } from './table';

const VIEWPORT = { duration: '5m' };

const DATA_STREAM: DataStream = {
  id: 'abc-1',
  data: [],
  resolution: 0,
  name: 'my-name',
};

const query = mockTimeSeriesDataQuery([
  {
    dataStreams: [DATA_STREAM],
    viewport: VIEWPORT,
    thresholds: [],
  },
]);

it('renders', async () => {
  expect(() => {
    render(
      <Table
        columnDefinitions={[]}
        items={[]}
        queries={[query]}
        viewport={VIEWPORT}
      />
    );
  }).not.toThrowError();
});

it('renders with assistant action panel', async () => {
  expect(() => {
    render(
      <Table
        columnDefinitions={[]}
        items={[]}
        queries={[query]}
        viewport={VIEWPORT}
        assistant={{
          client: {} as IoTSitewiseAssistantClient,
          conversationID: 'mockId',
        }}
      />
    );
  }).not.toThrowError();
});
