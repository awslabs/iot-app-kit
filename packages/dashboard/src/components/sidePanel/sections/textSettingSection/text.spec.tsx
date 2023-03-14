import React from 'react';
import { MOCK_TEXT_WIDGET } from '../../../../../testing/mocks';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureDashboardStore } from '~/store';
import TextSettings from './text';
import wrapper from '@cloudscape-design/components/test-utils/dom';
import type { DashboardState } from '~/store/state';
import type { TextWidget } from '~/customization/widgets/types';

const widget: TextWidget = {
  ...MOCK_TEXT_WIDGET,
  properties: {
    ...MOCK_TEXT_WIDGET.properties,
    fontSettings: {
      isBold: true,
      isItalic: true,
      isUnderlined: false,
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

const TestComponent = () => (
  <Provider store={configureDashboardStore(state)}>
    <TextSettings {...widget} />
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
  expect(bold?.className).toInclude('checked');
  const italic = elem.querySelector('[data-test-id="text-widget-setting-toggle-text-italic"]');
  expect(italic?.className).toInclude('checked');
  const underline = elem.querySelector('[data-test-id="text-widget-setting-toggle-text-underline"]');
  expect(underline?.className).not.toInclude('checked');
});
