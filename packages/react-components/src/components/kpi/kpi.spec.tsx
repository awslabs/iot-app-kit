import React from 'react';
import { render, renderHook, screen } from '@testing-library/react';
import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';
import { mockTimeSeriesDataQuery } from '@iot-app-kit/testing-util';
import { KPI } from './kpi';
import type { IoTSiteWise } from '@amzn/iot-black-pearl-internal-v3';
import type { AssistantActionEventDetail } from '../../common/assistantProps';
import { useAssistantContext } from '../../hooks/useAssistantContext/useAssistantContext';

const VIEWPORT = { duration: '5m' };

const LATEST_VALUE = 123.21;
const DATA_STREAM = {
  id: 'abc-1',
  data: [{ x: new Date(2000, 0, 0).getTime(), y: LATEST_VALUE }],
  resolution: 0,
  name: 'some name',
  unit: 'mph',
};
const query = mockTimeSeriesDataQuery([
  {
    dataStreams: [DATA_STREAM],
    viewport: VIEWPORT,
    thresholds: [],
  },
]);

const client = new IoTSitewiseAssistantClient({
  iotSiteWiseClient: {
    invokeAssistant: jest.fn(),
  } satisfies Pick<IoTSiteWise, 'invokeAssistant'>,
  defaultContext: '',
});

const assistant = {
  onAction: (_event: AssistantActionEventDetail) => jest.fn(),
  conversationID: 'conversationID',
  client,
};

it('renders', async () => {
  render(<KPI query={query} viewport={VIEWPORT} />);

  expect(screen.getByTestId('kpi-name-and-unit').textContent).toContain(
    DATA_STREAM.name
  );
  expect(screen.getByTestId('kpi-name-and-unit').textContent).toContain(
    DATA_STREAM.unit
  );
  expect(screen.getByTestId('kpi-value').textContent).toContain(
    `${DATA_STREAM.data[0].y}`
  );
  expect(screen.getByTestId('kpi-timestamp').textContent).toContain(
    new Date(DATA_STREAM.data[0].x).toLocaleString()
  );
});

it('renders with assistant action panel', async () => {
  expect(() => {
    render(<KPI query={query} viewport={VIEWPORT} assistant={assistant} />);
  }).not.toThrowError();
});

it('KPI pass context to the assistant', () => {
  const { result } = renderHook(() => useAssistantContext());
  render(<KPI query={query} viewport={VIEWPORT} assistant={assistant} />);

  const context = result.current.getAllAssistantContext();
  expect(context).toContain('timerange');
  expect(context).toContain('queries');
});
