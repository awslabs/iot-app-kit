import { MOCK_TEXT_LINK_WIDGET } from '../../../../testing/mocks';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureDashboardStore } from '~/store';
import { DefaultDashboardMessages } from '~/messages';
import type { DashboardState } from '~/store/state';
import { TextSettingsConfiguration } from './index';

const state: Partial<DashboardState> = {
  dashboardConfiguration: {
    widgets: [MOCK_TEXT_LINK_WIDGET],
  },
  selectedWidgetIds: [MOCK_TEXT_LINK_WIDGET.id],
};

const TestComponent = () => (
  <Provider store={configureDashboardStore(state)}>
    <TextSettingsConfiguration />
  </Provider>
);

it('renders', () => {
  const elem = render(<TestComponent />).baseElement;
  expect(elem);
});

it('renders with create link toggle', () => {
  const elem = render(<TestComponent />).baseElement;
  const toggle = elem.querySelector(
    '[data-test-id="text-widget-create-link-toggle"]'
  );
  expect(toggle?.textContent).toMatch(
    DefaultDashboardMessages.sidePanel.linkSettings.toggle
  );
});

it('renders with url input', () => {
  const elem = render(<TestComponent />).baseElement;
  const toggle = elem.querySelector('[data-test-id="text-widget-link-input"]');
  expect(toggle).toBeTruthy();
});
