import { Widget } from '~/types';
import { MOCK_KPI_WIDGET } from '../../../../../testing/mocks';
import { DashboardState } from '~/store/state';
import { Provider } from 'react-redux';
import { configureDashboardStore } from '~/store';
import { DefaultDashboardMessages } from '~/messages';
import { render } from '@testing-library/react';
import React from 'react';
import AxisSetting from './index';

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
    <AxisSetting messageOverrides={DefaultDashboardMessages} />
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
