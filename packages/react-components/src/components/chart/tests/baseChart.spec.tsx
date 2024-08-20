import React from 'react';
import { IoTSitewiseAssistantClient } from '@iot-app-kit/core-util';
import { mockTimeSeriesDataQuery } from '@iot-app-kit/testing-util';
import { DataStream } from '@iot-app-kit/core';
import { render } from '@testing-library/react';
import { Chart } from '../index';
import { ChartLegend } from '../types';

const VIEWPORT = { duration: '5m' };

const DATA_STREAM: DataStream = {
  id: 'abc-1',
  data: [],
  resolution: 0,
  name: 'my-name',
};
jest.mock('echarts', () => ({
  use: jest.fn(),
  init: jest.fn(),
  getInstanceByDom: jest.fn(),
  registerTheme: jest.fn(),
  connect: jest.fn(),
  disconnect: jest.fn(),
  graphic: jest.fn(),
  ComponentView: jest.fn(),
  ComponentModel: jest.fn(),
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
    const element = render(
      <Chart
        queries={[mockQuery]}
        onChartOptionsChange={jest.fn()}
        viewport={VIEWPORT}
        size={{ width: 500, height: 500 }}
      />
    );
    expect(element).not.toBeNull();
  });

  it('Chart renders with assistant action panel', () => {
    expect(() => {
      render(
        <Chart
          queries={[mockQuery]}
          onChartOptionsChange={jest.fn()}
          viewport={VIEWPORT}
          size={{ width: 500, height: 500 }}
          assistant={{
            client: {} as IoTSitewiseAssistantClient,
            conversationID: 'mockId',
          }}
        />
      );
    }).not.toThrowError();
  });
});

describe('Chart slider testing', () => {
  it('should show resize slider when show legend feature is on', () => {
    const options = {
      queries: [],
      aggregationType: 'average',
      axis: { showY: true, showX: true, yMin: undefined, yMax: undefined },
      legend: {
        visible: true,
        position: 'left' as keyof ChartLegend['position'],
        width: '30%',
        height: '30%',
        visibleContent: {
          unit: true,
          asset: true,
        },
      },
      onChartOptionsChange: jest.fn(),
      gestures: false,
      significantDigits: 4,
      styleSettings: {},
      thresholds: undefined,
    };

    const { container } = render(<Chart {...options} />);
    expect(container.getElementsByClassName('chart-timestamp').length).toBe(1);
    expect(
      container.getElementsByClassName('react-resizable-handle-se').length
    ).toBe(1);
  });

  it('should show resize slider when show legend feature is off', () => {
    const options = {
      queries: [],
      aggregationType: 'average',
      axis: { showY: true, showX: true, yMin: undefined, yMax: undefined },
      legend: {
        visible: false,
        position: 'bottom' as keyof ChartLegend['position'],
        width: '30%',
        height: '30%',
        visibleContent: {
          unit: true,
          asset: true,
        },
      },
      onChartOptionsChange: jest.fn(),
      gestures: false,
      significantDigits: 4,
      styleSettings: {},
      thresholds: undefined,
    };

    const { container } = render(<Chart {...options} />);
    expect(container.getElementsByClassName('chart-timestamp').length).toBe(1);
    expect(
      container.getElementsByClassName('react-resizable-handle-se').length
    ).toBe(0);
  });
});
