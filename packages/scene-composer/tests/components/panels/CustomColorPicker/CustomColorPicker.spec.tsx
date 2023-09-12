import { act, render } from '@testing-library/react';
import React from 'react';
import wrapper from '@awsui/components-react/test-utils/dom';
import {
  CustomColorPicker,
  DEFAULT_COLOR_PICKER_COLOR,
} from '../../../../src/components/panels/CustomColorPicker/CustomColorPicker';

jest.mock('@awsui/components-react', () => ({
  ...jest.requireActual('@awsui/components-react'),
}));

const onSubmitMock = jest.fn();
const onCancelMock = jest.fn();
const undefinedColor = <CustomColorPicker color={undefined} onSubmit={onSubmitMock} onCancel={onCancelMock} />;
const definedColor = <CustomColorPicker color='#123456' onSubmit={onSubmitMock} onCancel={onCancelMock} />;

describe('CustomColorPicker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should load', async () => {
    let container: HTMLElement | undefined;
    await act(async () => {
      const rendered = render(undefinedColor);
      container = rendered.container;
    });

    expect(container).toBeDefined();
  });

  it('should load with the default color if no color is provided', async () => {
    let container: HTMLElement | undefined;
    await act(async () => {
      const rendered = render(undefinedColor);
      container = rendered.container;
    });

    const polarisWrapper = wrapper(container);

    const hexInput = polarisWrapper.findInput('[data-testid=hex-input]');
    const redInput = polarisWrapper.findInput('[data-testid=red-input]');
    const greenInput = polarisWrapper.findInput('[data-testid=green-input]');
    const blueInput = polarisWrapper.findInput('[data-testid=blue-input]');

    expect(hexInput?.findNativeInput().getElement().value).toBe(DEFAULT_COLOR_PICKER_COLOR.hex);
    expect(redInput?.findNativeInput().getElement().value).toBe(DEFAULT_COLOR_PICKER_COLOR.rgb.r);
    expect(greenInput?.findNativeInput().getElement().value).toBe(DEFAULT_COLOR_PICKER_COLOR.rgb.g);
    expect(blueInput?.findNativeInput().getElement().value).toBe(DEFAULT_COLOR_PICKER_COLOR.rgb.b);
  });

  it('should load with the provided color', async () => {
    let container: HTMLElement | undefined;
    await act(async () => {
      const rendered = render(definedColor);
      container = rendered.container;
    });

    const polarisWrapper = wrapper(container);

    const hexInput = polarisWrapper.findInput('[data-testid=hex-input]');
    const redInput = polarisWrapper.findInput('[data-testid=red-input]');
    const greenInput = polarisWrapper.findInput('[data-testid=green-input]');
    const blueInput = polarisWrapper.findInput('[data-testid=blue-input]');

    expect(hexInput?.findNativeInput().getElement().value).toBe('#123456');
    expect(redInput?.findNativeInput().getElement().value).toBe('18');
    expect(greenInput?.findNativeInput().getElement().value).toBe('52');
    expect(blueInput?.findNativeInput().getElement().value).toBe('86');
  });

  it('should call onSubmit when save button is clicked', async () => {
    let container: HTMLElement | undefined;
    await act(async () => {
      const rendered = render(definedColor);
      container = rendered.container;
    });

    const polarisWrapper = wrapper(container);

    const saveButton = polarisWrapper.findButton('[data-testid=color-picker-save-button]');
    act(() => {
      saveButton?.click();
    });

    expect(onSubmitMock).toBeCalled();
  });

  it('should call onCancel when cancel button is clicked', async () => {
    let container: HTMLElement | undefined;
    await act(async () => {
      const rendered = render(definedColor);
      container = rendered.container;
    });

    const polarisWrapper = wrapper(container);

    const cancelButton = polarisWrapper.findButton('[data-testid=color-picker-cancel-button]');
    cancelButton?.click();

    expect(onCancelMock).toBeCalled();
  });

  it('should call onCancel when cancel button is clicked', async () => {
    let container: HTMLElement | undefined;
    await act(async () => {
      const rendered = render(definedColor);
      container = rendered.container;
    });

    const polarisWrapper = wrapper(container);

    const cancelButton = polarisWrapper.findButton('[data-testid=color-picker-cancel-button]');
    cancelButton?.click();

    expect(onCancelMock).toBeCalled();
  });

  it('should update the rgb fields if the hex field is changed', async () => {
    let container: HTMLElement | undefined;
    await act(async () => {
      const rendered = render(definedColor);
      container = rendered.container;
    });

    const polarisWrapper = wrapper(container);

    const hexInput = polarisWrapper.findInput('[data-testid=hex-input]');
    const redInput = polarisWrapper.findInput('[data-testid=red-input]');
    const greenInput = polarisWrapper.findInput('[data-testid=green-input]');
    const blueInput = polarisWrapper.findInput('[data-testid=blue-input]');

    hexInput?.setInputValue('#000000');

    expect(redInput?.findNativeInput().getElement().value).toBe('0');
    expect(greenInput?.findNativeInput().getElement().value).toBe('0');
    expect(blueInput?.findNativeInput().getElement().value).toBe('0');
  });

  it('should update the hex field if the rgb fields are changed', async () => {
    let container: HTMLElement | undefined;
    await act(async () => {
      const rendered = render(definedColor);
      container = rendered.container;
    });

    const polarisWrapper = wrapper(container);

    const hexInput = polarisWrapper.findInput('[data-testid=hex-input]');
    const redInput = polarisWrapper.findInput('[data-testid=red-input]');
    const greenInput = polarisWrapper.findInput('[data-testid=green-input]');
    const blueInput = polarisWrapper.findInput('[data-testid=blue-input]');

    redInput?.setInputValue('0');
    greenInput?.setInputValue('0');
    blueInput?.setInputValue('0');

    expect(hexInput?.findNativeInput().getElement().value).toBe('#000000');
  });

  it('should not submit if the hex input field has an error', async () => {
    let container: HTMLElement | undefined;
    await act(async () => {
      const rendered = render(definedColor);
      container = rendered.container;
    });

    const polarisWrapper = wrapper(container);

    const hexInput = polarisWrapper.findInput('[data-testid=hex-input]');
    const formField = polarisWrapper.findFormField('[data-testid=hex-input-form-field]');
    const saveButton = polarisWrapper.findButton('[data-testid=color-picker-save-button]');

    await act(() => {
      //need to wait for setStates
      hexInput?.setInputValue('#12');
    });

    await act(() => {
      saveButton?.click();
    });

    expect(formField?.findError()?.getElement().innerHTML).toBeDefined();
    expect(onSubmitMock).not.toBeCalled();
  });
});
