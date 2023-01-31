import React from 'react';
import { Provider } from 'react-redux';
import LegendSettings from './index';
import { DefaultDashboardMessages } from '../../../../messages';
import { configureDashboardStore } from '../../../../store';
import { Widget } from '../../../../types';
import { MOCK_KPI_WIDGET } from '../../../../../testing/mocks';
import { DashboardState } from '../../../../store/state';
import { render } from '@testing-library/react';

const widget: Widget = {
  ...MOCK_KPI_WIDGET,
};

const state: Partial<DashboardState> = {
  dashboardConfiguration: {
    widgets: [widget],
    viewport: { duration: '5m' },
  },
  selectedWidgets: [widget],
};

const TestComponent = () => (
  <Provider store={configureDashboardStore(state)}>
    <LegendSettings messageOverrides={DefaultDashboardMessages} />
  </Provider>
);

it('renders', () => {
  const elem = render(<TestComponent />).baseElement;
  expect(elem).toBeTruthy();
});

it('renders toggle for viewing legend', () => {
  const elem = render(<TestComponent />).baseElement;
  expect(elem.querySelector('[data-test-id="legend-setting-view-toggle"]')).toBeTruthy();
});

it('renders legend position select', () => {
  const elem = render(<TestComponent />).baseElement;
  expect(elem.querySelector('[data-test-id="legend-setting-position-select"]')).toBeTruthy();
});

it('renders legend width input', () => {
  const elem = render(<TestComponent />).baseElement;
  expect(elem.querySelector('[data-test-id="legend-setting-width-input"]')).toBeTruthy();
});

it('renders show data color toggle', () => {
  const elem = render(<TestComponent />).baseElement;
  expect(elem.querySelector('[data-test-id="legend-setting-color-data-toggle"]')).toBeTruthy();
});
