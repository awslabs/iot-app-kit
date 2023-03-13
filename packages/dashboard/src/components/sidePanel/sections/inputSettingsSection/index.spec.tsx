import React from 'react';
import { render } from '@testing-library/react';
import createWrapper from '@cloudscape-design/components/test-utils/dom';
import { Provider } from 'react-redux';
import InputSettings from './index';
import { configureDashboardStore } from '~/store';
import { MOCK_INPUT_WIDGET } from '../../../../../testing/mocks';
import { expect } from '@jest/globals';
import type { InputWidget } from '~/customization/widgets/types';

const TestComponent = (widget: InputWidget) => (
  <Provider
    store={configureDashboardStore({
      dashboardConfiguration: { widgets: [widget] },
      selectedWidgets: [widget],
    })}
  >
    <InputSettings {...widget} />
  </Provider>
);

it('renders without options', () => {
  const inputWithoutOptions = {
    ...MOCK_INPUT_WIDGET,
    properties: {
      ...MOCK_INPUT_WIDGET.properties,
      options: [],
    },
  };
  const { container } = render(<TestComponent {...inputWithoutOptions} />);
  const inputSettings = createWrapper(container);
  const options = inputSettings.findTokenGroup('[data-test-id="input-widget-token-list"]');

  expect(options?.findTokens().length).toBe(0);
});

// it.skip('renders with options from state', () => {
//   const { container } = render(<TestComponent />);
//   const inputSettings = createWrapper(container);
//   const options = inputSettings.findTokenGroup('[data-test-id="input-widget-token-list"]');

//   MOCK_INPUT_WIDGET.properties.options.forEach(({ label }) => {
//     expect(options.getElement()).toHaveTextContent(label);
//   });
// });

// it.skip('can add option', () => {
//   const { container } = render(<TestComponent />);
//   const inputSettings = createWrapper(container);
//   const addOptionButton = inputSettings.findButton('[data-test-id="input-widget-add-option-btn"]');
//   const optionInput = inputSettings.findInput('[data-test-id="input-widget-option-input"]');
//   const options = inputSettings.findTokenGroup('[data-test-id="input-widget-token-list"]');
//   const newOption = 'lorem ipsum';

//   expect(addOptionButton?.isDisabled()).toBeTruthy();
//   expect(options?.findTokens().length).toBe(3);
//   expect(options?.getElement()).not.toHaveTextContent(newOption);

//   optionInput?.setInputValue(newOption);

//   expect(addOptionButton.isDisabled()).toBeFalsy();
//   addOptionButton.click();

//   expect(options.findTokens().length).toBe(4);
//   expect(options.getElement()).toHaveTextContent(newOption);
// });

// it.skip('can remove option', () => {
//   const { container } = render(<TestComponent />);
//   const inputSettings = createWrapper(container);
//   const options = inputSettings.findTokenGroup('[data-test-id="input-widget-token-list"]');

//   expect(options.findTokens().length).toBe(3);

//   options.findToken(2).findDismiss().click();

//   expect(options.findTokens().length).toBe(2);
//   expect(options.findToken(1).getElement()).toHaveTextContent(widget.options[0].label);
//   expect(options.findToken(2).getElement()).toHaveTextContent(widget.options[2].label);
// });

// it.skip('correctly renders translations', () => {
//   const optionPlaceholder = 'lorem ipsum';
//   const addOptionLabel = 'lorem ipsum 2';
//   const props = {
//     messageOverride: {
//       ...DefaultDashboardMessages,
//       sidePanel: {
//         ...DefaultDashboardMessages.sidePanel,
//         inputSettings: {
//           ...DefaultDashboardMessages.sidePanel.inputSettings,
//           optionPlaceholder,
//           addOptionLabel,
//         },
//       },
//     },
//   };
//   const { container } = render(<TestComponent {...props} />);
//   const inputSettings = createWrapper(container);
//   const addOptionButton = inputSettings.findButton('[data-test-id="input-widget-add-option-btn"]');
//   const optionInput = inputSettings.findInput('[data-test-id="input-widget-option-input"]');

//   expect(addOptionButton.getElement()).toHaveTextContent(addOptionLabel);
//   expect(optionInput.findNativeInput().getElement()).toHaveAttribute('placeholder', optionPlaceholder);
// });
