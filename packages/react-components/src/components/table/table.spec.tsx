import React from 'react';
import { render } from '@testing-library/react';
import { mockTimeSeriesDataQuery } from '@iot-app-kit/testing-util';
import { DataStream } from '@iot-app-kit/core';
import { Table } from './table';

const VIEWPORT = { duration: '5m' };

const DATA_STREAM: DataStream = { id: 'abc-1', data: [], resolution: 0, name: 'my-name' };

it('renders', async () => {
  const query = mockTimeSeriesDataQuery([
    {
      dataStreams: [DATA_STREAM],
      viewport: VIEWPORT,
      thresholds: [],
    },
  ]);

  expect(() => {
    render(<Table columnDefinitions={[]} items={[]} queries={[query]} viewport={VIEWPORT} />);
  }).not.toThrowError();
});
