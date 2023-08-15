import React from 'react';
import { mockTimeSeriesDataQuery } from '@iot-app-kit/testing-util';
import { DataStream } from '@iot-app-kit/core';
import { Chart } from '../index';
import { render } from '@testing-library/react';

const VIEWPORT = { duration: '5m' };

const DATA_STREAM: DataStream = { id: 'abc-1', data: [], resolution: 0, name: 'my-name' };
jest.mock('echarts', () => ({
  use: jest.fn(),
  init: jest.fn(),
  getInstanceByDom: jest.fn(),
  registerTheme: jest.fn(),
  connect: jest.fn(),
  disconnect: jest.fn(),
}));

afterAll(() => {
  jest.clearAllMocks();
});

export const mockQuery = mockTimeSeriesDataQuery([
  {
    dataStreams: [DATA_STREAM],
    viewport: VIEWPORT,
    thresholds: [],
  },
]);
describe('Chart Component Testing', () => {
  it('Chart renders', () => {
    const query = mockTimeSeriesDataQuery([
      {
        dataStreams: [DATA_STREAM],
        viewport: VIEWPORT,
        thresholds: [],
      },
    ]);

    const element = render(<Chart queries={[query]} viewport={VIEWPORT} size={{ width: 500, height: 500 }} />);
    expect(element).not.toBeNull();
  });

  it('Chart renders', () => {
    const element = render(<Chart queries={[mockQuery]} viewport={VIEWPORT} size={{ width: 500, height: 500 }} />);
    expect(element).not.toBeNull();
  });
});
