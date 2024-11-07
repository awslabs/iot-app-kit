import { screen, render } from '@testing-library/react';
import { mockTimeSeriesDataQuery } from '@iot-app-kit/testing-util';
import { type DataStream } from '@iot-app-kit/core';
import { BarChart } from './barChart';

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
    <BarChart queries={[query]} viewport={VIEWPORT} />
  );
  const widget = container.querySelector('iot-app-kit-vis-bar-chart');

  expect(widget).not.toBeNull();

  expect(widget).toHaveProperty('viewport', expect.objectContaining(VIEWPORT));
  expect(widget).toHaveProperty('dataStreams', [DATA_STREAM]);
});

it('renders title when titleText is provided', () => {
  render(
    <BarChart
      queries={[query]}
      viewport={VIEWPORT}
      titleText='Bar-chart Title'
    />
  );

  expect(screen.getByText('Bar-chart Title')).toBeInTheDocument();
});
