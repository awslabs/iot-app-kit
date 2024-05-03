import React from 'react';
import { render } from '@testing-library/react';
import { AnomalyWidget } from '..';
import {
  MOCK_DATA_SOURCE_EMPTY_SUCCESS,
  MOCK_DATA_SOURCE_SUCCESS,
} from './mockDataSources';

const VIEWPORT = { duration: '5m' };

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

describe('Anomaly Chart Component Tests', () => {
  it('Anomaly chart renders', () => {
    const element = render(
      <AnomalyWidget
        viewport={VIEWPORT}
        datasources={[MOCK_DATA_SOURCE_SUCCESS]}
      />
    );
    expect(element).not.toBeNull();
  });

  it('Anomaly chart renders when data is empty', () => {
    const element = render(
      <AnomalyWidget
        viewport={VIEWPORT}
        datasources={[MOCK_DATA_SOURCE_EMPTY_SUCCESS]}
      />
    );
    expect(element).not.toBeNull();
  });
});
