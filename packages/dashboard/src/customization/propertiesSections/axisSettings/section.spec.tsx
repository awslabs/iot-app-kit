import { MOCK_LINE_CHART_WIDGET } from '../../../../testing/mocks';
import { Provider } from 'react-redux';
import { configureDashboardStore } from '../../../store';
import { DefaultDashboardMessages } from '../../../messages';
import { render } from '@testing-library/react';
import type { DashboardState } from '../../../store/state';
import { AxisSettingsConfiguration } from './index';

const state: Partial<DashboardState> = {
  dashboardConfiguration: {
    widgets: [MOCK_LINE_CHART_WIDGET],
  },
  selectedWidgets: [MOCK_LINE_CHART_WIDGET],
};

const TestComponent = () => (
  <Provider store={configureDashboardStore(state)}>
    <AxisSettingsConfiguration />
  </Provider>
);

it('renders', () => {
  const elem = render(<TestComponent />).baseElement;
  expect(elem).toBeTruthy();
});

it('renders toggles for both X and Y axis', async () => {
  const elem = render(<TestComponent />).baseElement;
  expect(
    elem.querySelector('[data-test-id="axis-setting-x-toggle"]')
  ).toBeTruthy();
  expect(
    elem.querySelector('[data-test-id="axis-setting-y-toggle"]')
  ).toBeTruthy();
});

it('renders label input for Y axis', () => {
  const elem = render(<TestComponent />).baseElement;
  expect(
    elem.querySelector('[data-test-id="axis-setting-y-label-content"]')
      ?.textContent
  ).toMatch(DefaultDashboardMessages.sidePanel.axisMessages.yLabelContent);
  expect(
    elem.querySelector('[data-test-id="axis-setting-y-label-input"]')
  ).toBeTruthy();
});
