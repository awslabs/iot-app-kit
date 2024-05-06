import wrapper from '@cloudscape-design/components/test-utils/dom';
import { act, render } from '@testing-library/react';
import React from 'react';

import { getGlobalSettings } from '../../../common/GlobalSettings';
import { accessStore } from '../../../store';
import { KnownSceneProperty, COMPOSER_FEATURES } from '../../../interfaces';

import { GroundPlaneSettingsEditor } from './GroundPlaneSettingsEditor';

jest.mock('../../../common/GlobalSettings');

jest.mock('@cloudscape-design/components', () => ({
  ...jest.requireActual('@cloudscape-design/components'),
}));

describe('GroundPlaneSettingsEditor', () => {
  const setScenePropertyMock = jest.fn();
  const getScenePropertyMock = jest.fn();
  const showAssetBrowserCallbackMock = jest.fn();

  const mockFeatureConfigOn = { [COMPOSER_FEATURES.Textures]: true };

  const baseState = {
    setSceneProperty: setScenePropertyMock,
    getSceneProperty: getScenePropertyMock,
    getEditorConfig: () => ({
      showAssetBrowserCallback: showAssetBrowserCallbackMock,
    }),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update background when colors changes', () => {
    getScenePropertyMock.mockImplementation((property: string) => {
      if (property === KnownSceneProperty.GroundPlaneSettings) {
        return {
          color: '#cccccc',
          opacity: 1,
        };
      } else if (property === KnownSceneProperty.GroundCustomColors) {
        const customColors: string[] = [];
        return customColors;
      }
    });
    const globalSettingsMock = getGlobalSettings as jest.Mock;
    globalSettingsMock.mockReturnValue({ featureConfig: mockFeatureConfigOn });
    accessStore('default').setState(baseState);
    const { container } = render(<GroundPlaneSettingsEditor />);
    const polarisWrapper = wrapper(container);
    const colorInput = polarisWrapper.findInput('[data-testid="hexcode"]');

    expect(colorInput).toBeDefined();

    // click checkbox should update store
    colorInput!.focus();
    colorInput!.setInputValue('#FFFFFF');
    colorInput!.blur();
    expect(setScenePropertyMock).toBeCalledTimes(2);
    expect(setScenePropertyMock).toBeCalledWith(KnownSceneProperty.GroundPlaneSettings, {
      color: '#FFFFFF',
      opacity: 1,
    });
  });

  it('should open asset browser when select texture clicked and set texture uri', () => {
    getScenePropertyMock.mockImplementation((property: string) => {
      if (property === KnownSceneProperty.GroundPlaneSettings) {
        return {
          color: '#cccccc',
          opacity: 0,
        };
      } else if (property === KnownSceneProperty.GroundCustomColors) {
        const customColors: string[] = [];
        return customColors;
      }
    });
    const globalSettingsMock = getGlobalSettings as jest.Mock;
    globalSettingsMock.mockReturnValue({ featureConfig: mockFeatureConfigOn });
    showAssetBrowserCallbackMock.mockImplementation((cb) => {
      cb(null, 'c:\file.jpg');
    });
    accessStore('default').setState(baseState);
    const { container } = render(<GroundPlaneSettingsEditor />);
    const polarisWrapper = wrapper(container);
    const selectTextureButton = polarisWrapper.findButton('[data-testid="select-texture-button"]');

    expect(selectTextureButton).toBeDefined();

    // click checkbox should update store
    act(() => {
      selectTextureButton!.click();
    });
    expect(showAssetBrowserCallbackMock).toBeCalledTimes(1);
    expect(setScenePropertyMock).toBeCalledWith(KnownSceneProperty.GroundPlaneSettings, {
      textureUri: 'c:\file.jpg',
      opacity: 1,
    });
  });

  it('should remove texture uri', () => {
    getScenePropertyMock.mockImplementation((property: string) => {
      if (property === KnownSceneProperty.GroundPlaneSettings) {
        return {
          textureUri: 'filepath',
          opacity: 1,
        };
      } else if (property === KnownSceneProperty.GroundCustomColors) {
        const customColors: string[] = [];
        return customColors;
      }
    });
    const globalSettingsMock = getGlobalSettings as jest.Mock;
    globalSettingsMock.mockReturnValue({ featureConfig: mockFeatureConfigOn });
    accessStore('default').setState(baseState);
    const { container } = render(<GroundPlaneSettingsEditor />);
    const polarisWrapper = wrapper(container);
    const removeTextureButton = polarisWrapper.findButton('[data-testid="remove-texture-button"]');

    expect(removeTextureButton).toBeDefined();

    // click checkbox should update store
    act(() => {
      removeTextureButton!.click();
    });
    expect(setScenePropertyMock).toBeCalledWith(KnownSceneProperty.GroundPlaneSettings, {
      color: '#00FF00',
      opacity: 1,
    });
  });

  it('should update opacity', () => {
    getScenePropertyMock.mockImplementation((property: string) => {
      if (property === KnownSceneProperty.GroundPlaneSettings) {
        return {
          textureUri: 'filepath',
          opacity: 0,
        };
      } else if (property === KnownSceneProperty.GroundCustomColors) {
        const customColors: string[] = [];
        return customColors;
      }
    });
    const globalSettingsMock = getGlobalSettings as jest.Mock;
    globalSettingsMock.mockReturnValue({ featureConfig: mockFeatureConfigOn });
    accessStore('default').setState(baseState);
    const { container } = render(<GroundPlaneSettingsEditor />);
    const polarisWrapper = wrapper(container);
    const opacityInput = polarisWrapper.findInput('[data-testid="ground-plane-opacity-input"]');

    expect(opacityInput).toBeDefined();

    // click checkbox should update store
    opacityInput!.focus();
    opacityInput!.setInputValue('100'); //input is in percent
    opacityInput!.blur();

    expect(setScenePropertyMock).toBeCalledWith(KnownSceneProperty.GroundPlaneSettings, {
      textureUri: 'filepath',
      opacity: 1,
    });
  });
});
