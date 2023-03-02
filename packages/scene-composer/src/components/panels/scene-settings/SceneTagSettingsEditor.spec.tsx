/* eslint-disable import/first */
import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import wrapper from '@awsui/components-react/test-utils/dom';

import { useStore } from '../../../store';
import { KnownComponentType, KnownSceneProperty } from '../../../interfaces';
import { DEFAULT_TAG_GLOBAL_SETTINGS } from '../../../common/constants';

import { SceneTagSettingsEditor } from './SceneTagSettingsEditor';

jest.mock('@awsui/components-react', () => ({
  ...jest.requireActual('@awsui/components-react'),
}));

const sleep = async (timeout: number) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

describe('SceneTagSettingsEditor', () => {
  const setScenePropertyMock = jest.fn();
  const getScenePropertyMock = jest.fn();
  const baseState = {
    setSceneProperty: setScenePropertyMock,
    getSceneProperty: getScenePropertyMock,
  };

  beforeEach(() => {
    jest.useRealTimers();
    getScenePropertyMock.mockReturnValue({
      [KnownComponentType.Tag]: DEFAULT_TAG_GLOBAL_SETTINGS,
    });
    jest.clearAllMocks();
  });

  it('should update store when input value changed', async () => {
    useStore('default').setState(baseState);
    const { container } = render(<SceneTagSettingsEditor />);
    const polarisWrapper = wrapper(container);
    const input = polarisWrapper.findInput();

    expect(input).toBeDefined();

    // change input should update store when value is valid
    input?.setInputValue('11');
    expect(setScenePropertyMock).toBeCalledTimes(1);
    expect(setScenePropertyMock).toBeCalledWith(KnownSceneProperty.ComponentSettings, {
      [KnownComponentType.Tag]: { ...DEFAULT_TAG_GLOBAL_SETTINGS, scale: 11 },
    });

    // change input should update store with 0 when value is invalid
    input?.setInputValue('-11');
    expect(setScenePropertyMock).toBeCalledTimes(2);
    expect(setScenePropertyMock).toBeCalledWith(KnownSceneProperty.ComponentSettings, {
      [KnownComponentType.Tag]: { ...DEFAULT_TAG_GLOBAL_SETTINGS, scale: 0 },
    });
  });

  it('should update input value when store value changed', async () => {
    useStore('default').setState(baseState);
    const { container } = render(<SceneTagSettingsEditor />);
    const polarisWrapper = wrapper(container);
    const input = polarisWrapper.findInput();

    expect(input).toBeDefined();
    expect(input?.findNativeInput().getElement().value).toEqual(String(DEFAULT_TAG_GLOBAL_SETTINGS.scale));

    getScenePropertyMock.mockReturnValue({
      [KnownComponentType.Tag]: { ...DEFAULT_TAG_GLOBAL_SETTINGS, scale: 6 },
    });
    act(() => {
      useStore('default').setState({ ...baseState });
    });

    expect(polarisWrapper.findInput()?.findNativeInput().getElement().value).toEqual('6');
  });

  it('should update store when checkbox clicked', async () => {
    useStore('default').setState(baseState);
    const { container } = render(<SceneTagSettingsEditor />);
    const polarisWrapper = wrapper(container);
    const checkbox = polarisWrapper.findCheckbox();

    expect(checkbox).toBeDefined();

    // click checkbox should update store
    checkbox?.findNativeInput().click();
    expect(setScenePropertyMock).toBeCalledTimes(1);
    expect(setScenePropertyMock).toBeCalledWith(KnownSceneProperty.ComponentSettings, {
      [KnownComponentType.Tag]: {
        ...DEFAULT_TAG_GLOBAL_SETTINGS,
        autoRescale: !DEFAULT_TAG_GLOBAL_SETTINGS.autoRescale,
      },
    });
  });

  it('should update store when slider value changed', async () => {
    useStore('default').setState(baseState);
    const { container } = render(<SceneTagSettingsEditor />);
    const polarisWrapper = wrapper(container);

    // slider is hidden initially
    expect(screen.queryAllByTestId('slider').length).toBe(0);

    // show slider when input gets focus
    const input = polarisWrapper.findInput();
    act(() => {
      input?.focus();
    });
    const slider = screen.queryAllByTestId('slider');
    expect(slider.length).toBe(1);

    await act(async () => {
      slider[0].focus();

      input?.blur();
      // wait for setTimeOut in code
      await sleep(2);

      // update slider value should update store
      fireEvent.change(slider[0], { target: { value: '3' } });
    });

    expect(setScenePropertyMock).toBeCalledTimes(1);
    expect(setScenePropertyMock).toBeCalledWith(KnownSceneProperty.ComponentSettings, {
      [KnownComponentType.Tag]: { ...DEFAULT_TAG_GLOBAL_SETTINGS, scale: 3 },
    });

    // hide slider when slider lost focus
    act(() => {
      slider[0].blur();
    });
    expect(screen.queryAllByTestId('slider').length).toBe(0);
  });
});
