import { render } from '@testing-library/react';
import { mockTimeSeriesDataQuery } from '@iot-app-kit/testing-util';
import { LineChart } from './lineChart';
import { type DataStream } from '@iot-app-kit/core';

const VIEWPORT = { duration: '5m' };

const DATA_STREAM: DataStream = {
  id: 'abc-1',
  data: [],
  resolution: 0,
  name: 'my-name',
  color: 'black',
};

it('renders', async () => {
  const query = mockTimeSeriesDataQuery([
    {
      dataStreams: [DATA_STREAM],
      viewport: VIEWPORT,
      thresholds: [],
    },
  ]);

  const { container } = render(
    <LineChart queries={[query]} viewport={VIEWPORT} />
  );
  const widget = container.querySelector('iot-app-kit-vis-line-chart');

  expect(widget).not.toBeNull();

  expect(widget).toHaveProperty('viewport', expect.objectContaining(VIEWPORT));
  expect(widget).toHaveProperty('dataStreams', [DATA_STREAM]);
});
