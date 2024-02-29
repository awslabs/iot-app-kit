import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockTimeSeriesDataQuery } from '@iot-app-kit/testing-util';
import { KPI } from './kpi';

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

  render(<KPI query={query} viewport={VIEWPORT} />);

  expect(screen.getByTestId('kpi-name-and-unit').textContent).toContain(
    DATA_STREAM.name
  );
  expect(screen.getByTestId('kpi-name-and-unit').textContent).toContain(
    DATA_STREAM.unit
  );
  expect(screen.getByTestId('kpi-value').textContent).toContain(
    `${DATA_STREAM.data[0].y} `
  );
  expect(screen.getByTestId('kpi-timestamp').textContent).toContain(
    new Date(DATA_STREAM.data[0].x).toLocaleString()
  );
});
