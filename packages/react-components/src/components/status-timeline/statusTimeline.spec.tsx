import React from 'react';
import { screen, render } from '@testing-library/react';
import { mockTimeSeriesDataQuery } from '@iot-app-kit/testing-util';
import { StatusTimeline } from './statusTimeline';
import { DataStream } from '@iot-app-kit/core';

const VIEWPORT = { duration: '5m' };

const DATA_STREAM: DataStream = {
  id: 'abc-1',
  data: [],
  resolution: 0,
  name: 'my-name',
  color: 'black',
};

const query = mockTimeSeriesDataQuery([
  {
    dataStreams: [DATA_STREAM],
    viewport: VIEWPORT,
    thresholds: [],
  },
]);

it('renders', async () => {
  const { container } = render(
    <StatusTimeline queries={[query]} viewport={VIEWPORT} />
  );
  const chart = container.querySelector('iot-app-kit-vis-status-timeline');

  expect(chart).not.toBeNull();

  expect(chart).toHaveProperty('viewport.duration', VIEWPORT.duration);
  expect(chart).toHaveProperty('dataStreams', [DATA_STREAM]);
});

it('renders title when titleText is provided', () => {
  render(
    <StatusTimeline
      queries={[query]}
      viewport={VIEWPORT}
      titleText='Status Timeline Title'
    />
  );

  expect(screen.getByText('Status Timeline Title')).toBeInTheDocument();
});
