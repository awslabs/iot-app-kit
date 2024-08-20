import React from 'react';
import { render } from '@testing-library/react';
import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';
import { mockTimeSeriesDataQuery } from '@iot-app-kit/testing-util';
import { Gauge } from './gauge';

const VIEWPORT = { duration: '5m' };

const LATEST_VALUE = 123.2;
const DATA_STREAM = {
  id: 'mock-data-stream',
  data: [{ x: new Date(2024, 0, 0).getTime(), y: LATEST_VALUE }],
  resolution: 0,
  name: 'mock-name',
  unit: 'mph',
};
const query = mockTimeSeriesDataQuery([
  {
    dataStreams: [DATA_STREAM],
    viewport: VIEWPORT,
    thresholds: [],
  },
]);

it('renders', async () => {
  const element = render(<Gauge query={query} viewport={VIEWPORT} />);
  expect(element).not.toBeNull();
});

it('renders with assistant action panel', async () => {
  expect(() => {
    render(
      <Gauge
        query={query}
        viewport={VIEWPORT}
        assistant={{
          client: {} as IoTSitewiseAssistantClient,
          conversationID: 'mockId',
        }}
      />
    );
  }).not.toThrowError();
});
