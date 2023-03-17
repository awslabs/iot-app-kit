import React from 'react';
import { render } from '@testing-library/react';
import { mockTimeSeriesDataQuery } from '@iot-app-kit/testing-util';
import { DataStream } from '@iot-app-kit/core';
import { BarChart } from './barChart';

const VIEWPORT = { duration: '5m' };

const DATA_STREAM: DataStream = { id: 'abc-1', data: [], resolution: 0, name: 'my-name' };

it('renders', async () => {
  const query = mockTimeSeriesDataQuery([
    {
      dataStreams: [DATA_STREAM],
      viewport: VIEWPORT,
      annotations: {},
    },
  ]);

  const { container } = render(<BarChart queries={[query]} viewport={VIEWPORT} />);
  const chart = container.querySelector('sc-bar-chart');

  expect(chart).not.toBeNull();

  expect(chart).toHaveProperty('viewport', VIEWPORT);
  expect(chart).toHaveProperty('dataStreams', [DATA_STREAM]);
});
