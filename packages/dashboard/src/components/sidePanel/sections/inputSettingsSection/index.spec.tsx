import React from 'react';
import { render } from '@testing-library/react';
import createWrapper from '@cloudscape-design/components/test-utils/dom';
import { Provider } from 'react-redux';
import InputSettings from './index';
import { InputWidget, RecursivePartial } from '~/types';
import { DashboardState } from '~/store/state';
import { DefaultDashboardMessages, DashboardMessages } from '~/messages';
import { configureDashboardStore } from '~/store';
import { MOCK_INPUT_WIDGET } from '../../../../../testing/mocks';
import { expect } from '@jest/globals';

const widget: InputWidget = { ...MOCK_INPUT_WIDGET };

const state: Partial<DashboardState> = {
  dashboardConfiguration: {
    widgets: [widget],
    viewport: { duration: '5m' },
  },
  selectedWidgets: [widget],
};

const TestComponent = (
  {
    stateOverride = state,
    messageOverride = DefaultDashboardMessages,
  }: {
    stateOverride?: RecursivePartial<DashboardState>;
    messageOverride?: DashboardMessages;
  } = { stateOverride: state, messageOverride: DefaultDashboardMessages }
) => (
  <Provider store={configureDashboardStore(stateOverride)}>
    <InputSettings messageOverride={messageOverride} />
  </Provider>
);

it('renders without options from state', () => {
  const props = { stateOverride: {} };
  const { container } = render(<TestComponent {...props} />);
  const inputSettings = createWrapper(container);
  const options = inputSettings.findTokenGroup('[data-test-id="input-widget-token-list"]');

  expect(options.findTokens().length).toBe(0);
});

it('renders with options from state', () => {
  const { container } = render(<TestComponent />);
  const inputSettings = createWrapper(container);
  const options = inputSettings.findTokenGroup('[data-test-id="input-widget-token-list"]');

  MOCK_INPUT_WIDGET.options.forEach(({ label }) => {
    expect(options.getElement()).toHaveTextContent(label);
  });
});

it('can add option', () => {
  const { container } = render(<TestComponent />);
  const inputSettings = createWrapper(container);
  const addOptionButton = inputSettings.findButton('[data-test-id="input-widget-add-option-btn"]');
  const optionInput = inputSettings.findInput('[data-test-id="input-widget-option-input"]');
  const options = inputSettings.findTokenGroup('[data-test-id="input-widget-token-list"]');
  const newOption = 'lorem ipsum';

  expect(addOptionButton.isDisabled()).toBeTruthy();
  expect(options.findTokens().length).toBe(3);
  expect(options.getElement()).not.toHaveTextContent(newOption);

  optionInput.setInputValue(newOption);

  expect(addOptionButton.isDisabled()).toBeFalsy();
  addOptionButton.click();

  expect(options.findTokens().length).toBe(4);
  expect(options.getElement()).toHaveTextContent(newOption);
});

it('can remove option', () => {
  const { container } = render(<TestComponent />);
  const inputSettings = createWrapper(container);
  const options = inputSettings.findTokenGroup('[data-test-id="input-widget-token-list"]');

  expect(options.findTokens().length).toBe(3);

  options.findToken(2).findDismiss().click();

  expect(options.findTokens().length).toBe(2);
  expect(options.findToken(1).getElement()).toHaveTextContent(widget.options[0].label);
  expect(options.findToken(2).getElement()).toHaveTextContent(widget.options[2].label);
});

it('correctly renders translations', () => {
  const optionPlaceholder = 'lorem ipsum';
  const addOptionLabel = 'lorem ipsum 2';
  const props = {
    messageOverride: {
      ...DefaultDashboardMessages,
      sidePanel: {
        ...DefaultDashboardMessages.sidePanel,
        inputSettings: {
          ...DefaultDashboardMessages.sidePanel.inputSettings,
          optionPlaceholder,
          addOptionLabel,
        },
      },
    },
  };
  const { container } = render(<TestComponent {...props} />);
  const inputSettings = createWrapper(container);
  const addOptionButton = inputSettings.findButton('[data-test-id="input-widget-add-option-btn"]');
  const optionInput = inputSettings.findInput('[data-test-id="input-widget-option-input"]');

  expect(addOptionButton.getElement()).toHaveTextContent(addOptionLabel);
  expect(optionInput.findNativeInput().getElement()).toHaveAttribute('placeholder', optionPlaceholder);
});
