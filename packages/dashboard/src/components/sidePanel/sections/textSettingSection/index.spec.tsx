import React from 'react';
import { TextWidget } from '../../../../types';
import { MOCK_TEXT_WIDGET } from '../../../../../testing/mocks';
import { DashboardState } from '../../../../store/state';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureDashboardStore } from '../../../../store';
import TextSettings from './text';
import { DefaultDashboardMessages } from '../../../../messages';
import wrapper from '@cloudscape-design/components/test-utils/dom';

const widget: TextWidget = { ...MOCK_TEXT_WIDGET, bold: true, italic: true, underline: false };

const state: Partial<DashboardState> = {
  dashboardConfiguration: {
    widgets: [widget],
    viewport: { duration: '5m' },
  },
  selectedWidgets: [widget],
};

const TestComponent = () => (
  <Provider store={configureDashboardStore(state)}>
    <TextSettings messageOverride={DefaultDashboardMessages} />
  </Provider>
);

it('renders', () => {
  expect(render(<TestComponent />));
});

it('renders with font select', () => {
  const elem = render(<TestComponent />).container;
  expect(wrapper(elem).findSelect('[data-test-id="text-widget-setting-font"]'));
});

it('renders with font size select', () => {
  const elem = render(<TestComponent />).container;
  expect(wrapper(elem).findSelect('[data-test-id="text-widget-setting-font-size"]'));
});

it('renders with horizontal alignment select', () => {
  const elem = render(<TestComponent />).container;
  expect(wrapper(elem).findSelect('[data-test-id="text-widget-setting-horizontal-align"]'));
});

it('renders with vertical alignment select', () => {
  const elem = render(<TestComponent />).container;
  expect(wrapper(elem).findSelect('[data-test-id="text-widget-setting-vertical-align"]'));
});

it('renders with font style toggles with correct style', () => {
  const elem = render(<TestComponent />).container;
  const bold = elem.querySelector('[data-test-id="text-widget-setting-toggle-text-bold"]');
  expect(bold?.className).toBe('text-style-button checked');
  const italic = elem.querySelector('[data-test-id="text-widget-setting-toggle-text-italic"]');
  expect(italic?.className).toBe('text-style-button checked');
  const underline = elem.querySelector('[data-test-id="text-widget-setting-toggle-text-underline"]');
  expect(underline?.className).toBe('text-style-button');
});
