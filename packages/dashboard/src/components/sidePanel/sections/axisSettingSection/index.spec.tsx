import { MOCK_KPI_WIDGET } from '../../../../../testing/mocks';
import { Provider } from 'react-redux';
import { configureDashboardStore } from '~/store';
import { DefaultDashboardMessages } from '~/messages';
import { render } from '@testing-library/react';
import React from 'react';
import AxisSetting from './index';
import type { DashboardState } from '~/store/state';

const state: Partial<DashboardState> = {
  dashboardConfiguration: {
    widgets: [MOCK_KPI_WIDGET],
    viewport: { duration: '5m' },
  },
  selectedWidgets: [MOCK_KPI_WIDGET],
};

const TestComponent = () => (
  <Provider store={configureDashboardStore(state)}>
    <AxisSetting {...MOCK_KPI_WIDGET} />
  </Provider>
);

it('renders', () => {
  const elem = render(<TestComponent />).baseElement;
  expect(elem).toBeTruthy();
});

it('renders toggles for both X and Y axis', () => {
  const elem = render(<TestComponent />).baseElement;
  expect(elem.querySelector('[data-test-id="axis-setting-x-toggle"]')).toBeTruthy();
  expect(elem.querySelector('[data-test-id="axis-setting-y-toggle"]')).toBeTruthy();
});

it('renders label input for Y axis', () => {
  const elem = render(<TestComponent />).baseElement;
  expect(elem.querySelector('[data-test-id="axis-setting-y-label-content"]')?.textContent).toMatch(
    DefaultDashboardMessages.sidePanel.axisMessages.yLabelContent
  );
  expect(elem.querySelector('[data-test-id="axis-setting-y-label-input"]')).toBeTruthy();
});
