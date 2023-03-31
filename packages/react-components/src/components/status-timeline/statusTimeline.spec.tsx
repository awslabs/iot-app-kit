import React from 'react';
import { render } from '@testing-library/react';
import { mockTimeSeriesDataQuery } from '@iot-app-kit/testing-util';
import { StatusTimeline } from './statusTimeline';
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

  const { container } = render(<StatusTimeline queries={[query]} viewport={VIEWPORT} />);
  const chart = container.querySelector('iot-app-kit-vis-status-timeline');

  expect(chart).not.toBeNull();

  expect(chart).toHaveProperty('viewport.duration', VIEWPORT.duration);
  expect(chart).toHaveProperty('dataStreams', [DATA_STREAM]);
});
