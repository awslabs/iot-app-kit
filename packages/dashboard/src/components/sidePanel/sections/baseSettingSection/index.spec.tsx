import { Widget } from '../../../../types';
import { MOCK_KPI_WIDGET } from '../../../../../testing/mocks';
import { DashboardState } from '../../../../store/state';
import { Provider } from 'react-redux';
import { configureDashboardStore } from '../../../../store';
import { DefaultDashboardMessages } from '../../../../messages';
import React from 'react';
import { BaseSettings } from './index';
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

const TestBaseSettingSection = () => (
  <Provider store={configureDashboardStore(state)}>
    <BaseSettings messageOverrides={DefaultDashboardMessages} />
  </Provider>
);

it('renders', () => {
  const elem = render(<TestBaseSettingSection />).baseElement;
  expect(elem).toBeTruthy();
});

it('renders all input fields', () => {
  const elem = render(<TestBaseSettingSection />).baseElement;
  expect(elem.querySelector('[data-test-id="base-setting-x-input"]')).toBeTruthy();
  expect(elem.querySelector('[data-test-id="base-setting-y-input"]')).toBeTruthy();
  expect(elem.querySelector('[data-test-id="base-setting-height-input"]')).toBeTruthy();
  expect(elem.querySelector('[data-test-id="base-setting-width-input"]')).toBeTruthy();
});
