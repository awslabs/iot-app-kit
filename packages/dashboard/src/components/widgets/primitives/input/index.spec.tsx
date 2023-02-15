import React from 'react';
import { render } from '@testing-library/react';
import createWrapper from '@cloudscape-design/components/test-utils/dom';
import InputWidget from './index';
import { MOCK_INPUT_WIDGET } from '../../../../../testing/mocks';

it('is disabled in edit mode', () => {
  const props = { ...MOCK_INPUT_WIDGET, readOnly: false };
  const { container } = render(<InputWidget {...props} />);
  const widget = createWrapper(container);

  expect(widget.findButton('[data-test-id="input-widget-submit-btn"]').isDisabled()).toBeTruthy();
  expect(widget.findSelect('[data-test-id="input-widget-options"]').isDisabled()).toBeTruthy();
});

it('is enabled in read-only mode', () => {
  const props = { ...MOCK_INPUT_WIDGET, readOnly: true };
  const { container } = render(<InputWidget {...props} />);
  const widget = createWrapper(container);

  expect(widget.findButton('[data-test-id="input-widget-submit-btn"]').isDisabled()).toBeFalsy();
  expect(widget.findSelect('[data-test-id="input-widget-options"]').isDisabled()).toBeFalsy();
});

it('is disabled in read-only mode if no options', () => {
  const props = { ...MOCK_INPUT_WIDGET, options: [], readOnly: true };
  const { container } = render(<InputWidget {...props} />);
  const widget = createWrapper(container);

  expect(widget.findButton('[data-test-id="input-widget-submit-btn"]').isDisabled()).toBeTruthy();
  expect(widget.findSelect('[data-test-id="input-widget-options"]').isDisabled()).toBeTruthy();
});

it('correctly renders translations', () => {
  const submitLabel = 'lorem ipsum';
  const props = { ...MOCK_INPUT_WIDGET, messageOverrides: { submitLabel }, readOnly: true };
  const { container } = render(<InputWidget {...props} />);
  const widget = createWrapper(container);

  expect(widget.findButton('[data-test-id="input-widget-submit-btn"]').getElement()).toHaveTextContent(submitLabel);
});

it('correctly re-renders when options update', () => {
  const props = { ...MOCK_INPUT_WIDGET, readOnly: true };
  const { container, rerender } = render(<InputWidget {...props} />);
  const widget = createWrapper(container);
  const options = widget.findSelect('[data-test-id="input-widget-options"]');

  options!.openDropdown();

  // finds all options
  MOCK_INPUT_WIDGET.options.forEach(({ label }) => {
    expect(options.getElement()).toHaveTextContent(label);
  });

  // first option is selected by default
  expect(options.findDropdown().findSelectedOptions()[0].getElement()).toHaveTextContent(
    MOCK_INPUT_WIDGET.options[0].label
  );

  // if selected option is removed, set new selected option to first option
  rerender(<InputWidget {...props} options={[MOCK_INPUT_WIDGET.options[1], MOCK_INPUT_WIDGET.options[2]]} />);
  expect(options.getElement()).toHaveTextContent(MOCK_INPUT_WIDGET.options[1].label);

  // if all options are removed, there is no selected option
  rerender(<InputWidget {...props} options={[]} />);
  expect(options.findDropdown().findSelectedOptions().length).toBe(0);

  // if new options added, first option is selected
  rerender(<InputWidget {...props} options={[MOCK_INPUT_WIDGET.options[2], MOCK_INPUT_WIDGET.options[1]]} />);
  expect(options.findDropdown().findSelectedOptions()[0].getElement()).toHaveTextContent(
    MOCK_INPUT_WIDGET.options[2].label
  );
});

it('can select option', () => {
  const props = { ...MOCK_INPUT_WIDGET, readOnly: true };
  const { container } = render(<InputWidget {...props} />);
  const widget = createWrapper(container);
  const options = widget.findSelect('[data-test-id="input-widget-options"]');

  options.openDropdown();

  // first option is selected by default
  expect(options.findDropdown().findSelectedOptions()[0].getElement()).toHaveTextContent(
    MOCK_INPUT_WIDGET.options[0].label
  );

  options.selectOption(2);
  options.openDropdown();

  // new option is selected
  expect(options.findDropdown().findSelectedOptions()[0].getElement()).toHaveTextContent(
    MOCK_INPUT_WIDGET.options[1].label
  );
});
