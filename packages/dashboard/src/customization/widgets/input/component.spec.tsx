import React from 'react';
import { Provider } from 'react-redux';
import merge from 'lodash/merge';
import { render } from '@testing-library/react';
import createWrapper from '@cloudscape-design/components/test-utils/dom';
import InputWidget from './component';
import { configureDashboardStore } from '~/store';
import { MOCK_INPUT_WIDGET } from '../../../../testing/mocks';

const mockInputWidgetOptions = MOCK_INPUT_WIDGET.properties.options;
const storeArgs = { dashboardConfiguration: { widgets: [MOCK_INPUT_WIDGET] } };

it.skip('is disabled in edit mode', () => {
  const { container } = render(
    <Provider store={configureDashboardStore({ readOnly: false, ...storeArgs })}>
      <InputWidget {...MOCK_INPUT_WIDGET} />
    </Provider>
  );
  const widget = createWrapper(container);

  expect(widget.findButton('[data-test-id="input-widget-submit-btn"]')?.isDisabled()).toBeTruthy();
  expect(widget.findSelect('[data-test-id="input-widget-options"]')?.isDisabled()).toBeTruthy();
});

it.skip('is enabled in read-only mode', () => {
  const { container } = render(
    <Provider store={configureDashboardStore({ readOnly: true, ...storeArgs })}>
      <InputWidget {...MOCK_INPUT_WIDGET} />
    </Provider>
  );
  const widget = createWrapper(container);

  expect(widget.findButton('[data-test-id="input-widget-submit-btn"]')?.isDisabled()).toBeFalsy();
  expect(widget.findSelect('[data-test-id="input-widget-options"]')?.isDisabled()).toBeFalsy();
});

it.skip('is disabled in read-only mode if no options', () => {
  const inputWidget = merge(MOCK_INPUT_WIDGET, { properties: { options: [] } });

  const { container } = render(
    <Provider store={configureDashboardStore({ readOnly: true, ...storeArgs })}>
      <InputWidget {...inputWidget} />
    </Provider>
  );
  const widget = createWrapper(container);

  expect(widget.findButton('[data-test-id="input-widget-submit-btn"]')?.isDisabled()).toBeTruthy();
  expect(widget.findSelect('[data-test-id="input-widget-options"]')?.isDisabled()).toBeTruthy();
});

it.skip('correctly re-renders when options update', () => {
  const { container, rerender } = render(
    <Provider store={configureDashboardStore({ readOnly: true, ...storeArgs })}>
      <InputWidget {...MOCK_INPUT_WIDGET} />
    </Provider>
  );
  const widget = createWrapper(container);
  const options = widget.findSelect('[data-test-id="input-widget-options"]');

  options!.openDropdown();

  // finds all options
  mockInputWidgetOptions.forEach(({ label }) => {
    expect(options?.getElement()).toHaveTextContent(label);
  });

  // first option is selected by default
  expect(options?.findDropdown().findSelectedOptions()[0].getElement()).toHaveTextContent(
    mockInputWidgetOptions[0].label
  );

  const inputWidgetWithoutFirstOption = {
    ...MOCK_INPUT_WIDGET,
    properties: {
      ...MOCK_INPUT_WIDGET.properties,
      options: [mockInputWidgetOptions[1], mockInputWidgetOptions[2]],
    },
  };
  // if selected option is removed, set new selected option to first option
  rerender(
    <Provider store={configureDashboardStore({ readOnly: true, ...storeArgs })}>
      <InputWidget {...inputWidgetWithoutFirstOption} />
    </Provider>
  );
  expect(options?.getElement()).toHaveTextContent(mockInputWidgetOptions[1].label);

  const inputWidgetWithoutanyOptions = {
    ...MOCK_INPUT_WIDGET,
    properties: {
      ...MOCK_INPUT_WIDGET.properties,
      options: [],
    },
  };
  // if all options are removed, there is no selected option
  rerender(
    <Provider store={configureDashboardStore({ readOnly: true, ...storeArgs })}>
      <InputWidget {...inputWidgetWithoutanyOptions} />
    </Provider>
  );
  expect(options?.findDropdown().findSelectedOptions().length).toBe(0);

  const inputWidgetWithReversedOptions = {
    ...MOCK_INPUT_WIDGET,
    properties: {
      ...MOCK_INPUT_WIDGET.properties,
      options: [mockInputWidgetOptions[2], mockInputWidgetOptions[1]],
    },
  };
  // if new options added, first option is selected
  rerender(
    <Provider store={configureDashboardStore({ readOnly: true, ...storeArgs })}>
      <InputWidget {...inputWidgetWithReversedOptions} />
    </Provider>
  );
  expect(options?.findDropdown().findSelectedOptions()[0].getElement()).toHaveTextContent(
    mockInputWidgetOptions[2].label
  );
});

it.skip('can select option', () => {
  const { container } = render(
    <Provider store={configureDashboardStore({ readOnly: true, ...storeArgs })}>
      <InputWidget {...MOCK_INPUT_WIDGET} />
    </Provider>
  );
  const widget = createWrapper(container);
  const options = widget.findSelect('[data-test-id="input-widget-options"]');

  options?.openDropdown();

  // first option is selected by default
  expect(options?.findDropdown().findSelectedOptions()[0].getElement()).toHaveTextContent(
    MOCK_INPUT_WIDGET.properties.options[0].label
  );

  options?.selectOption(2);
  options?.openDropdown();

  // new option is selected
  expect(options?.findDropdown().findSelectedOptions()[0].getElement()).toHaveTextContent(
    mockInputWidgetOptions[1].label
  );
});
