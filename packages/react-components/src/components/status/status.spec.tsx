import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockTimeSeriesDataQuery } from '@iot-app-kit/testing-util';
import { Status } from './status';

const VIEWPORT = { duration: '5m' };

const LATEST_VALUE = 123.2;
const DATA_STREAM = {
  id: 'abc-1',
  data: [{ x: new Date(2000, 0, 0).getTime(), y: LATEST_VALUE }],
  resolution: 0,
  name: 'some name',
  unit: 'mph',
};

it('renders', async () => {
  const query = mockTimeSeriesDataQuery([
    {
      dataStreams: [DATA_STREAM],
      viewport: VIEWPORT,
      thresholds: [],
    },
  ]);

  render(<Status query={query} viewport={VIEWPORT} />);

  expect(screen.queryByText(DATA_STREAM.unit)).not.toBeNull();
  expect(screen.queryByText(LATEST_VALUE)).not.toBeNull();
});
