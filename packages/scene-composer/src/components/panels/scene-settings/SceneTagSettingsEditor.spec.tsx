/* eslint-disable import/first */
import { act, fireEvent, render, screen } from '@testing-library/react';
import wrapper from '@cloudscape-design/components/test-utils/dom';

import { accessStore } from '../../../store';
import { KnownComponentType, KnownSceneProperty } from '../../../interfaces';
import { DEFAULT_TAG_GLOBAL_SETTINGS } from '../../../common/constants';
import useTagSettings from '../../../hooks/useTagSettings';

import { SceneTagSettingsEditor } from './SceneTagSettingsEditor';

jest.mock('@cloudscape-design/components', () => ({
  ...jest.requireActual('@cloudscape-design/components'),
}));

jest.mock('../../../hooks/useTagSettings', () => jest.fn());

const sleep = async (timeout: number) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

describe('SceneTagSettingsEditor', () => {
  const setScenePropertyMock = jest.fn();
  const getScenePropertyMock = jest.fn();
  const isViewingMock = jest.fn();
  const setTagSettingsMock = jest.fn();
  const baseState = {
    setSceneProperty: setScenePropertyMock,
    getSceneProperty: getScenePropertyMock,
    isViewing: isViewingMock,
    noHistoryStates: {
      ...accessStore('default').getState().noHistoryStates,
      tagSettings: DEFAULT_TAG_GLOBAL_SETTINGS,
      setTagSettings: setTagSettingsMock,
    },
  };

  beforeEach(() => {
    jest.useRealTimers();
    getScenePropertyMock.mockReturnValue({
      [KnownComponentType.Tag]: DEFAULT_TAG_GLOBAL_SETTINGS,
    });
    (useTagSettings as jest.Mock).mockReturnValue(DEFAULT_TAG_GLOBAL_SETTINGS);
    isViewingMock.mockReturnValue(false);
    jest.clearAllMocks();
  });

  it('should update store and view options when input value changed', async () => {
    accessStore('default').setState(baseState);
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
    expect(setTagSettingsMock).toBeCalledTimes(1);
    expect(setTagSettingsMock).toBeCalledWith({
      ...DEFAULT_TAG_GLOBAL_SETTINGS,
      scale: 11,
    });

    // change input should update store with 0 when value is invalid
    input?.setInputValue('-11');
    expect(setScenePropertyMock).toBeCalledTimes(2);
    expect(setScenePropertyMock).toBeCalledWith(KnownSceneProperty.ComponentSettings, {
      [KnownComponentType.Tag]: { ...DEFAULT_TAG_GLOBAL_SETTINGS, scale: 0 },
    });
    expect(setTagSettingsMock).toBeCalledTimes(2);
    expect(setTagSettingsMock).toBeCalledWith({
      ...DEFAULT_TAG_GLOBAL_SETTINGS,
      scale: 0,
    });
  });

  it('should only store input value change to view options when in viewing mode', async () => {
    accessStore('default').setState(baseState);
    isViewingMock.mockReturnValue(true);
    const { container } = render(<SceneTagSettingsEditor />);
    const polarisWrapper = wrapper(container);
    const input = polarisWrapper.findInput();

    expect(input).toBeDefined();

    // change input should update store when value is valid
    input?.setInputValue('11');
    expect(setScenePropertyMock).not.toBeCalled();
    expect(setTagSettingsMock).toBeCalledTimes(1);
    expect(setTagSettingsMock).toBeCalledWith({
      ...DEFAULT_TAG_GLOBAL_SETTINGS,
      scale: 11,
    });
  });

  it('should update store when checkbox clicked', async () => {
    accessStore('default').setState(baseState);
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
    expect(setTagSettingsMock).toBeCalledTimes(1);
    expect(setTagSettingsMock).toBeCalledWith({
      ...DEFAULT_TAG_GLOBAL_SETTINGS,
      autoRescale: !DEFAULT_TAG_GLOBAL_SETTINGS.autoRescale,
    });
  });

  it('should update store when slider value changed', async () => {
    accessStore('default').setState(baseState);
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

      fireEvent.mouseDown(slider[0]);
      // update slider value should update store
      fireEvent.change(slider[0], { target: { value: '3' } });
    });

    act(() => {
      fireEvent.mouseUp(slider[0]);
    });

    expect(setScenePropertyMock).toBeCalledTimes(1);
    expect(setScenePropertyMock).toBeCalledWith(KnownSceneProperty.ComponentSettings, {
      [KnownComponentType.Tag]: { ...DEFAULT_TAG_GLOBAL_SETTINGS, scale: 3 },
    });
    expect(setTagSettingsMock).toBeCalledTimes(1);
    expect(setTagSettingsMock).toBeCalledWith({
      ...DEFAULT_TAG_GLOBAL_SETTINGS,
      scale: 3,
    });

    // hide slider when slider lost focus
    act(() => {
      slider[0].blur();
    });
    expect(screen.queryAllByTestId('slider').length).toBe(0);
  });

  it('should update view options immediately when slider value changed in viewing mode', async () => {
    accessStore('default').setState(baseState);
    isViewingMock.mockReturnValue(true);
    const { container } = render(<SceneTagSettingsEditor />);
    const polarisWrapper = wrapper(container);

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

      fireEvent.mouseDown(slider[0]);
      // update slider value should update store
      fireEvent.change(slider[0], { target: { value: '3' } });
    });

    expect(setScenePropertyMock).not.toBeCalled();
    expect(setTagSettingsMock).toBeCalledTimes(1);
    expect(setTagSettingsMock).toBeCalledWith({
      ...DEFAULT_TAG_GLOBAL_SETTINGS,
      scale: 3,
    });
  });

  describe('Show tag through objects - enableOcclusion', () => {
    it('should update view option with document settings', () => {
      accessStore('default').setState(baseState);
      render(<SceneTagSettingsEditor />);

      expect(baseState.noHistoryStates.tagSettings?.enableOcclusion).toBeFalsy();
    });

    it('should update tag settings when toggled', () => {
      accessStore('default').setState(baseState);
      const { container } = render(<SceneTagSettingsEditor />);
      const polarisWrapper = wrapper(container);
      const toggle = polarisWrapper.findToggle();

      expect(toggle).not.toBeNull();
      expect(baseState.noHistoryStates.tagSettings?.enableOcclusion).toBeFalsy();

      act(() => {
        toggle!.findNativeInput().click();
      });

      expect(setScenePropertyMock).toBeCalledTimes(1);
      expect(setTagSettingsMock).toBeCalledTimes(1);
      expect(setTagSettingsMock).toBeCalledWith({
        ...DEFAULT_TAG_GLOBAL_SETTINGS,
        enableOcclusion: true,
      });
    });

    it('should not update scene property when toggled in viewing mode', () => {
      accessStore('default').setState(baseState);
      isViewingMock.mockReturnValue(true);
      const { container } = render(<SceneTagSettingsEditor />);
      const polarisWrapper = wrapper(container);
      const toggle = polarisWrapper.findToggle();

      expect(toggle).not.toBeNull();
      expect(baseState.noHistoryStates.tagSettings?.enableOcclusion).toBeFalsy();

      act(() => {
        toggle!.findNativeInput().click();
      });

      expect(setScenePropertyMock).not.toBeCalled();
      expect(setTagSettingsMock).toBeCalledTimes(1);
      expect(setTagSettingsMock).toBeCalledWith({
        ...DEFAULT_TAG_GLOBAL_SETTINGS,
        enableOcclusion: true,
      });
    });
  });
});
