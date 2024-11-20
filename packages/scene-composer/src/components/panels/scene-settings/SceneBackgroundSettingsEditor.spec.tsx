import wrapper from '@cloudscape-design/components/test-utils/dom';
import { act, render } from '@/tests/testing-library';

import { getGlobalSettings } from '../../../common/GlobalSettings';
import { COMPOSER_FEATURES, KnownSceneProperty } from '../../../interfaces';
import { accessStore } from '../../../store';

import { SceneBackgroundSettingsEditor } from './SceneBackgroundSettingsEditor';

vi.mock('../../../common/GlobalSettings');

vi.mock('@cloudscape-design/components', async () => ({
  ...(await vi.importActual('@cloudscape-design/components')),
}));

describe('SceneBackgroundSettingsEditor', () => {
  const setScenePropertyMock = vi.fn();
  const getScenePropertyMock = vi.fn();
  const showAssetBrowserCallbackMock = vi.fn();

  const mockFeatureConfigOn = { [COMPOSER_FEATURES.Textures]: true };

  const baseState = {
    setSceneProperty: setScenePropertyMock,
    getSceneProperty: getScenePropertyMock,
    getEditorConfig: () => ({
      showAssetBrowserCallback: showAssetBrowserCallbackMock,
    }),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should save background on clean scene', () => {
    getScenePropertyMock.mockImplementation((property: string) => {
      if (property === KnownSceneProperty.SceneBackgroundSettings) {
        return undefined;
      } else if (property === KnownSceneProperty.BackgroundCustomColors) {
        const customColors: string[] = [];
        return customColors;
      }
    });
    const globalSettingsMock = getGlobalSettings as vi.Mock;
    globalSettingsMock.mockReturnValue({ featureConfig: mockFeatureConfigOn });
    accessStore('default').setState(baseState);

    render(<SceneBackgroundSettingsEditor />);

    expect(setScenePropertyMock).toBeCalledTimes(1);
    expect(setScenePropertyMock).toBeCalledWith(KnownSceneProperty.SceneBackgroundSettings, {
      color: 'var(--color-background-container-content-4un1ap, #ffffff)',
    });
  });

  it('should update background when colors changes', () => {
    getScenePropertyMock.mockImplementation((property: string) => {
      if (property === KnownSceneProperty.SceneBackgroundSettings) {
        return {
          color: '#cccccc',
        };
      } else if (property === KnownSceneProperty.BackgroundCustomColors) {
        const customColors: string[] = [];
        return customColors;
      }
    });
    const globalSettingsMock = getGlobalSettings as vi.Mock;
    globalSettingsMock.mockReturnValue({ featureConfig: mockFeatureConfigOn });
    accessStore('default').setState(baseState);
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

  it('should open asset browser when select texture clicked and set texture uri', () => {
    getScenePropertyMock.mockImplementation((property: string) => {
      if (property === KnownSceneProperty.SceneBackgroundSettings) {
        return {
          color: '#cccccc',
        };
      } else if (property === KnownSceneProperty.BackgroundCustomColors) {
        const customColors: string[] = [];
        return customColors;
      }
    });
    const globalSettingsMock = getGlobalSettings as vi.Mock;
    globalSettingsMock.mockReturnValue({ featureConfig: mockFeatureConfigOn });
    showAssetBrowserCallbackMock.mockImplementation((cb) => {
      cb(null, 'c:\file.jpg');
    });
    accessStore('default').setState(baseState);
    const { container } = render(<SceneBackgroundSettingsEditor />);
    const polarisWrapper = wrapper(container);
    const selectTextureButton = polarisWrapper.findButton('[data-testid="select-texture-button"]');

    expect(selectTextureButton).toBeDefined();

    // click checkbox should update store
    act(() => {
      selectTextureButton!.click();
    });
    expect(showAssetBrowserCallbackMock).toBeCalledTimes(1);
    expect(setScenePropertyMock).toBeCalledWith(KnownSceneProperty.SceneBackgroundSettings, {
      textureUri: 'c:\file.jpg',
    });
  });

  it('should remove texture uri', () => {
    getScenePropertyMock.mockImplementation((property: string) => {
      if (property === KnownSceneProperty.SceneBackgroundSettings) {
        return {
          textureUri: 'filepath',
        };
      } else if (property === KnownSceneProperty.BackgroundCustomColors) {
        const customColors: string[] = [];
        return customColors;
      }
    });
    const globalSettingsMock = getGlobalSettings as vi.Mock;
    globalSettingsMock.mockReturnValue({ featureConfig: mockFeatureConfigOn });
    accessStore('default').setState(baseState);
    const { container } = render(<SceneBackgroundSettingsEditor />);
    const polarisWrapper = wrapper(container);
    const removeTextureButton = polarisWrapper.findButton('[data-testid="remove-texture-button"]');

    expect(removeTextureButton).toBeDefined();

    // click checkbox should update store
    act(() => {
      removeTextureButton!.click();
    });
    expect(setScenePropertyMock).toBeCalledWith(KnownSceneProperty.SceneBackgroundSettings, {
      color: 'var(--color-background-container-content-4un1ap, #ffffff)',
    });
  });
});
