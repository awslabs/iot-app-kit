import { Widget } from '~/types';
import { MOCK_KPI_WIDGET } from '../../../../../testing/mocks';
import { DashboardState } from '~/store/state';
import { Provider } from 'react-redux';
import { configureDashboardStore } from '~/store';
import { DefaultDashboardMessages } from '~/messages';
import React from 'react';
import { BaseSettings } from './index';
import { render } from '@testing-library/react';
import createWrapper from '@cloudscape-design/components/test-utils/dom';
import userEvent from '@testing-library/user-event';
import { expect } from '@jest/globals';

const widget: Widget = {
  ...MOCK_KPI_WIDGET,
  x: 1.5,
  y: 2,
  width: 10.1,
  height: 10.9,
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
  const wrapper = createWrapper(render(<TestBaseSettingSection />).baseElement);
  expect(wrapper.findInput('[data-test-id="base-setting-x-input"]')).toBeTruthy();
  expect(wrapper.findInput('[data-test-id="base-setting-y-input"]')).toBeTruthy();
  expect(wrapper.findInput('[data-test-id="base-setting-width-input"]')).toBeTruthy();
  expect(wrapper.findInput('[data-test-id="base-setting-height-input"]')).toBeTruthy();
});

it('rounds x,y,height,width input', () => {
  const wrapper = createWrapper(render(<TestBaseSettingSection />).baseElement);
  expect(wrapper.findInput('[data-test-id="base-setting-x-input"]')?.findNativeInput().getElement().value).toBe('2');
  expect(wrapper.findInput('[data-test-id="base-setting-y-input"]')?.findNativeInput().getElement().value).toBe('2');
  expect(wrapper.findInput('[data-test-id="base-setting-width-input"]')?.findNativeInput().getElement().value).toBe(
    '10'
  );
  expect(wrapper.findInput('[data-test-id="base-setting-height-input"]')?.findNativeInput().getElement().value).toBe(
    '11'
  );
});

it('rounds input on user input', async () => {
  const wrapper = createWrapper(render(<TestBaseSettingSection />).baseElement);
  const xInput = wrapper.findInput('[data-test-id="base-setting-x-input"]')!.findNativeInput().getElement();
  await userEvent.type(xInput!, '2.4'); // current x is 2, this type appends 2 after it.
  expect(xInput?.value).toBe('22'); // decimal digits on typing will be ignored not rounded.
});
