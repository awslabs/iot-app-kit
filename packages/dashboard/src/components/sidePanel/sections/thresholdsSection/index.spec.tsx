import React from 'react';

import { MOCK_KPI_WIDGET } from '../../../../../testing/mocks';
import { DashboardState } from '~/store/state';
import { COMPARISON_OPERATOR } from '@synchro-charts/core';
import { Provider } from 'react-redux';
import { configureDashboardStore } from '~/store';
import ThresholdsSection, { ThresholdWidget } from './thresholdsSection';
import { render } from '@testing-library/react';
import { ThresholdComponent } from './thresholdComponent';
import { ThresholdSettings } from '~/customization/settings';

const MOCK_THRESHOLD_1: ThresholdSettings['thresholds'][number] = {
  id: '1',
  color: '#00ff00',
  comparisonOperator: COMPARISON_OPERATOR.EQUAL,
  comparisonValue: 10,
};

const MOCK_THRESHOLD_2: ThresholdSettings['thresholds'][number] = {
  id: '2',
  color: '#0000ff',
  comparisonOperator: COMPARISON_OPERATOR.GREATER_THAN_EQUAL,
  comparisonValue: 15,
};

const widget: ThresholdWidget = {
  ...MOCK_KPI_WIDGET,
  properties: {
    ...MOCK_KPI_WIDGET.properties,
    thresholdSettings: {
      colorAcrossThresholds: false,
      thresholds: [MOCK_THRESHOLD_1, MOCK_THRESHOLD_2],
    },
  },
};

const state: Partial<DashboardState> = {
  dashboardConfiguration: {
    widgets: [widget],
    viewport: { duration: '5m' },
  },
  selectedWidgets: [widget],
};

const TestThresholdSection = () => (
  <Provider store={configureDashboardStore(state)}>
    <ThresholdsSection {...widget} />
  </Provider>
);

const TestThresholdComponent = () => (
  <Provider store={configureDashboardStore(state)}>
    <ThresholdComponent
      threshold={MOCK_THRESHOLD_1}
      comparisonOptions={[]}
      onDelete={() => {}}
      onUpdateValue={() => {}}
      onUpdateComparisonOperator={() => {}}
      onUpdateColor={() => {}}
    />
  </Provider>
);

describe('thresholdsComponent', () => {
  it('renders', () => {
    const result = render(<TestThresholdComponent />);
    const elem = result.baseElement;
    expect(elem);
  });

  it('renders operator select', () => {
    const elem = render(<TestThresholdComponent />).baseElement;
    expect(elem.querySelector('[data-test-id="threshold-component-operator-select"]')).toBeTruthy();
  });

  it('renders threshold value input', () => {
    const elem = render(<TestThresholdComponent />).baseElement;
    expect(elem.querySelector('[data-test-id="threshold-component-value-input"]')).toBeTruthy();
  });

  it('renders color picker', () => {
    const elem = render(<TestThresholdComponent />).baseElement;
    expect(elem.querySelector('[data-test-id="threshold-component-color-picker"]')).toBeTruthy();
  });

  it('renders delete button', () => {
    const elem = render(<TestThresholdComponent />).baseElement;
    expect(elem.querySelector('[data-test-id="threshold-component-delete-button"]')).toBeTruthy();
  });
});

describe('thresholdsSection', () => {
  it('renders', () => {
    const elem = render(<TestThresholdSection />).baseElement;
    expect(elem).toBeTruthy();
  });

  it('renders correct numbers of thresholds', () => {
    const elem = render(<TestThresholdSection />).baseElement;
    const components = Array.from(elem.querySelectorAll('[data-test-id="threshold-component"]'));
    expect(components.length).toEqual(widget.properties.thresholdSettings?.thresholds.length);
  });
});
