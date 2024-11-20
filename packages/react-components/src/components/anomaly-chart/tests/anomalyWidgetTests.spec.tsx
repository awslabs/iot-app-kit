import { render } from '@testing-library/react';
import { AnomalyChart } from '..';
import {
  MOCK_DATA_SOURCE_EMPTY_SUCCESS,
  MOCK_DATA_SOURCE_SUCCESS,
} from './mockDataSources';

const VIEWPORT = { duration: '5m' };

vi.mock('echarts', () => ({
  use: vi.fn(),
  init: vi.fn(),
  getInstanceByDom: vi.fn(),
  registerTheme: vi.fn(),
  connect: vi.fn(),
  disconnect: vi.fn(),
  graphic: vi.fn(),
  ComponentView: vi.fn(),
  ComponentModel: vi.fn(),
}));

afterAll(() => {
  vi.clearAllMocks();
});

describe('Anomaly Chart Component Tests', () => {
  it('Anomaly chart renders', () => {
    const element = render(
      <AnomalyChart viewport={VIEWPORT} data={[MOCK_DATA_SOURCE_SUCCESS]} />
    );
    expect(element).not.toBeNull();
  });

  it('Anomaly chart renders when data is empty', () => {
    const element = render(
      <AnomalyChart
        viewport={VIEWPORT}
        data={[MOCK_DATA_SOURCE_EMPTY_SUCCESS]}
      />
    );
    expect(element).not.toBeNull();
  });
});
