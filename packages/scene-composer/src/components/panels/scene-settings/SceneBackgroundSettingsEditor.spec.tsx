import wrapper from '@awsui/components-react/test-utils/dom';
import { act, render } from '@testing-library/react';
import React from 'react';

import { useStore } from '../../../store';
import { KnownSceneProperty } from '../../../interfaces';

import { SceneBackgroundSettingsEditor } from './SceneBackgroundSettingsEditor';

jest.mock('@awsui/components-react', () => ({
  ...jest.requireActual('@awsui/components-react'),
}));

describe('SceneBackgroundSettingsEditor', () => {
  const setScenePropertyMock = jest.fn();
  const getScenePropertyMock = jest.fn();
  const baseState = {
    setSceneProperty: setScenePropertyMock,
    getSceneProperty: getScenePropertyMock,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should save background when checked', async () => {
    getScenePropertyMock.mockReturnValue(undefined);
    useStore('default').setState(baseState);
    const { container } = render(<SceneBackgroundSettingsEditor />);
    const polarisWrapper = wrapper(container);
    const checkbox = polarisWrapper.findCheckbox();

    expect(checkbox).toBeDefined();

    // click checkbox should update store
    act(() => {
      checkbox?.findNativeInput().click();
    });
    expect(setScenePropertyMock).toBeCalledTimes(1);
    expect(setScenePropertyMock).toBeCalledWith(KnownSceneProperty.SceneBackgroundSettings, {
      color: '#cccccc',
    });
  });

  it('should clear background when unchecked', async () => {
    getScenePropertyMock.mockReturnValue({
      color: '#cccccc',
    });
    useStore('default').setState(baseState);
    const { container } = render(<SceneBackgroundSettingsEditor />);
    const polarisWrapper = wrapper(container);
    const checkbox = polarisWrapper.findCheckbox();

    expect(checkbox).toBeDefined();

    // click checkbox should update store
    act(() => {
      checkbox?.findNativeInput().click();
    });
    expect(setScenePropertyMock).toBeCalledTimes(1);
    expect(setScenePropertyMock).toBeCalledWith(KnownSceneProperty.SceneBackgroundSettings, undefined);
  });

  it('should update background when colors changes', async () => {
    getScenePropertyMock.mockImplementation((property: string) => {
      if (property === KnownSceneProperty.SceneBackgroundSettings) {
        return {
          color: '#cccccc',
        };
      } else if (property === KnownSceneProperty.TagCustomColors) {
        const customColors: string[] = [];
        return customColors;
      }
    });
    useStore('default').setState(baseState);
    const { container } = render(<SceneBackgroundSettingsEditor />);
    const polarisWrapper = wrapper(container);
    const colorInput = polarisWrapper.findInput('[data-testid="hexcode"]');

    expect(colorInput).toBeDefined();

    // click checkbox should update store
    colorInput!.focus();
    colorInput!.setInputValue('#FFFFFF');
    colorInput!.blur();
    expect(setScenePropertyMock).toBeCalledTimes(2);
    expect(setScenePropertyMock).toBeCalledWith(KnownSceneProperty.SceneBackgroundSettings, {
      color: '#FFFFFF',
    });
  });
});
