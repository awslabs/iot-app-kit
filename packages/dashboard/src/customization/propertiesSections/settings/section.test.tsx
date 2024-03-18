import { MOCK_LINE_CHART_WIDGET } from '../../../../testing/mocks';
import { Provider } from 'react-redux';
import { configureDashboardStore } from '~/store';
import { getByLabelText, render } from '@testing-library/react';
import React from 'react';
import type { DashboardState } from '~/store/state';
import { SettingsConfiguration } from './index';

const state: Partial<DashboardState> = {
  dashboardConfiguration: {
    widgets: [MOCK_LINE_CHART_WIDGET],
  },
  selectedWidgets: [MOCK_LINE_CHART_WIDGET],
};

const TestComponent = () => (
  <Provider store={configureDashboardStore(state)}>
    <SettingsConfiguration />
  </Provider>
);

it('renders', () => {
  const elem = render(<TestComponent />).baseElement;
  expect(elem).toBeTruthy();
});

it('renders the decimal places input', async () => {
  const elem = render(<TestComponent />).baseElement;
  expect(getByLabelText(elem, 'decimal places')).toBeTruthy();
});
