import React from 'react';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import createWrapper from '@cloudscape-design/components/test-utils/dom';
import userEvent from '@testing-library/user-event';
import { MOCK_KPI_WIDGET } from '../../../../../testing/mocks';
import { BaseSettings } from './index';
import { configureDashboardStore } from '../../../../store';
import type { KPIWidget } from '../../../../customization/widgets/types';
import type { DashboardState } from '../../../../store/state';

const widget: KPIWidget = {
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
    <BaseSettings {...widget} />
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

it.skip('rounds input on user input', async () => {
  render(<TestBaseSettingSection />);
  const user = userEvent.setup();
  // const wrapper = createWrapper(render(<TestBaseSettingSection />).baseElement);
  const xInput = screen.getByLabelText('X');
  // const inputWrapper = createWrapper(xInput);
  // console.log(xInput);
  await act(async () => {
    await user.type(screen.getByLabelText('X'), '4.75');
  });

  expect(xInput).toHaveValue('5'); // decimal digits on typing will be ignored not rounded.
});
