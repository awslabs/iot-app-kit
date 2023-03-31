import React from 'react';
import { render } from '@testing-library/react';
import { mockTimeSeriesDataQuery } from '@iot-app-kit/testing-util';
import { ScatterChart } from './scatterChart';
import { DataStream } from '@iot-app-kit/core';

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

  const { container } = render(<ScatterChart queries={[query]} viewport={VIEWPORT} />);
  const widget = container.querySelector('iot-app-kit-vis-scatter-chart');

  expect(widget).not.toBeNull();

  expect(widget).toHaveProperty('viewport', expect.objectContaining(VIEWPORT));
  expect(widget).toHaveProperty('dataStreams', [DATA_STREAM]);
});
