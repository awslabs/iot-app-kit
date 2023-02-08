import React from 'react';
import { TextWidget } from '../../../../types';
import { MOCK_TEXT_WIDGET } from '../../../../../testing/mocks';
import { DashboardState } from '../../../../store/state';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureDashboardStore } from '../../../../store';
import { DefaultDashboardMessages } from '../../../../messages';
import LinkSettings from './link';

const widget: TextWidget = { ...MOCK_TEXT_WIDGET, link: 'sample-link' };

const state: Partial<DashboardState> = {
  dashboardConfiguration: {
    widgets: [widget],
    viewport: { duration: '5m' },
  },
  selectedWidgets: [widget],
};

const TestComponent = () => (
  <Provider store={configureDashboardStore(state)}>
    <LinkSettings messageOverride={DefaultDashboardMessages} />
  </Provider>
);

it('renders', () => {
  const elem = render(<TestComponent />).baseElement;
  expect(elem);
});

it('renders with create link toggle', () => {
  const elem = render(<TestComponent />).baseElement;
  const toggle = elem.querySelector('[data-test-id="text-widget-create-link-toggle"]');
  expect(toggle?.textContent).toMatch(DefaultDashboardMessages.sidePanel.linkSettings.toggle);
});

it('renders with url input', () => {
  const elem = render(<TestComponent />).baseElement;
  const toggle = elem.querySelector('[data-test-id="text-widget-link-input"]');
  expect(toggle).toBeTruthy();
});
