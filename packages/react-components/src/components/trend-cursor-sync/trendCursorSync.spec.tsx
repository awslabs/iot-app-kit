import { describe, expect } from '@jest/globals';
import { render } from '@testing-library/react';
import { TrendCursorSync } from './index';
import { Chart } from '../chart';
import React from 'react';
import { mockViewport } from '../chart/trendCursor/tests/getTrendCursor.spec';
import { mockQuery } from '../chart/tests/baseChart.spec';
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
describe('TrendCursorSync', () => {
  it('renders the component', () => {
    const syncComponent = render(
      <TrendCursorSync groupId='group1'>
        <Chart
          viewport={mockViewport}
          queries={[mockQuery]}
          size={{ width: 800, height: 500 }}
          onChartOptionsChange={jest.fn()}
          theme='light'
          id='chart1'
        />
      </TrendCursorSync>
    );
    expect(!!syncComponent).toBeTruthy();
  });

  it('renders multiple chart component', () => {
    const syncComponent = render(
      <TrendCursorSync groupId='group1'>
        <Chart
          viewport={mockViewport}
          queries={[mockQuery]}
          size={{ width: 800, height: 500 }}
          onChartOptionsChange={jest.fn()}
          theme='light'
          id='chart1'
        />
        <Chart
          viewport={mockViewport}
          queries={[mockQuery]}
          size={{ width: 800, height: 500 }}
          onChartOptionsChange={jest.fn()}
          theme='light'
          id='chart1'
        />
      </TrendCursorSync>
    );
    expect(!!syncComponent).toBeTruthy();
  });
});
