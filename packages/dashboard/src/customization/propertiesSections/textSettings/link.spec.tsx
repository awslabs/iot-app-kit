import React from 'react';

import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { DefaultDashboardMessages } from '~/messages';
import { MOCK_TEXT_LINK_WIDGET } from '../../../../testing/mocks';
import { TextSettingsConfiguration } from './index';

const state: Partial<DashboardState> = {
  dashboardConfiguration: {
    widgets: [MOCK_TEXT_LINK_WIDGET],
  },
  selectedWidgets: [MOCK_TEXT_LINK_WIDGET],
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
