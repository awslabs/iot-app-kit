import wrapper from '@cloudscape-design/components/test-utils/dom';
import { act, render } from '@/tests/testing-library';

import { mockComponent, mockNode } from '../../../../tests/components/panels/scene-components/MockComponents';
import { getGlobalSettings } from '../../../common/GlobalSettings';
import { COMPOSER_FEATURES, KnownComponentType } from '../../../interfaces';
import { type IPlaneGeometryComponentInternal, accessStore } from '../../../store';

import { PlaneGeometryComponentEditor } from './PlaneGeometryComponentEditor';

vi.mock('../../../common/GlobalSettings');

vi.mock('@cloudscape-design/components', async () => ({
  ...(await vi.importActual('@cloudscape-design/components')),
}));

describe('PlaneGeometryComponentEditor', () => {
  const component: IPlaneGeometryComponentInternal = {
    ...mockComponent,
    type: KnownComponentType.PlaneGeometry,
    width: 10,
    height: 20,
  };

  const componentWithColor: IPlaneGeometryComponentInternal = {
    ...mockComponent,
    type: KnownComponentType.PlaneGeometry,
    width: 10,
    height: 20,
    color: '#abcdef',
  };

  const componentWithTexturedPlane: IPlaneGeometryComponentInternal = {
    ...mockComponent,
    type: KnownComponentType.PlaneGeometry,
    width: 10,
    height: 20,
    textureUri: 'filepath',
  };

  const mockFeatureConfigOn = { [COMPOSER_FEATURES.Textures]: true };

  const updateComponentInternalFn = vi.fn();
  const showAssetBrowserCallbackMock = vi.fn();
  const baseState = {
    updateComponentInternal: updateComponentInternalFn,
    getEditorConfig: () => ({
      showAssetBrowserCallback: showAssetBrowserCallbackMock,
    }),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update width when width changes', () => {
    const globalSettingsMock = getGlobalSettings as vi.Mock;
    globalSettingsMock.mockReturnValue({ featureConfig: mockFeatureConfigOn });
    accessStore('default').setState(baseState);
    const { container } = render(
      <PlaneGeometryComponentEditor node={{ ...mockNode, components: [component] }} component={component} />,
    );
    const polarisWrapper = wrapper(container);
    const widthInput = polarisWrapper.findInput('[data-testid="plane-width-input"]');

    expect(widthInput).toBeDefined();

    widthInput!.focus();
    widthInput!.setInputValue('2');
    widthInput!.blur();

    expect(updateComponentInternalFn).toBeCalledTimes(1);
    expect(updateComponentInternalFn).toBeCalledWith(mockNode.ref, { ...component, width: 2 }, true);
  });

  it('should update height when height changes', () => {
    const globalSettingsMock = getGlobalSettings as vi.Mock;
    globalSettingsMock.mockReturnValue({ featureConfig: mockFeatureConfigOn });

    accessStore('default').setState(baseState);
    const { container } = render(
      <PlaneGeometryComponentEditor node={{ ...mockNode, components: [component] }} component={component} />,
    );
    const polarisWrapper = wrapper(container);
    const heightInput = polarisWrapper.findInput('[data-testid="plane-height-input"]');

    expect(heightInput).toBeDefined();

    heightInput!.focus();
    heightInput!.setInputValue('2');
    heightInput!.blur();

    expect(updateComponentInternalFn).toBeCalledTimes(1);
    expect(updateComponentInternalFn).toBeCalledWith(mockNode.ref, { ...component, height: 2 }, true);
  });

  it('should update when colors changes', () => {
    const globalSettingsMock = getGlobalSettings as vi.Mock;
    globalSettingsMock.mockReturnValue({ featureConfig: mockFeatureConfigOn });

    accessStore('default').setState(baseState);
    const { container } = render(
      <PlaneGeometryComponentEditor
        node={{ ...mockNode, components: [componentWithColor] }}
        component={componentWithColor}
      />,
    );
    const polarisWrapper = wrapper(container);
    const colorInput = polarisWrapper.findInput('[data-testid="hexcode"]');

    expect(colorInput).toBeDefined();

    // click checkbox should update store
    colorInput!.focus();
    colorInput!.setInputValue('#FFFFFF');
    colorInput!.blur();
    expect(updateComponentInternalFn).toBeCalledTimes(1);
    expect(updateComponentInternalFn).toBeCalledWith(mockNode.ref, { ...componentWithColor, color: '#FFFFFF' }, true);
  });

  it('should add open resource manager when select texture clicked and set texture', () => {
    const globalSettingsMock = getGlobalSettings as vi.Mock;
    globalSettingsMock.mockReturnValue({ featureConfig: mockFeatureConfigOn });

    showAssetBrowserCallbackMock.mockImplementation((cb) => {
      cb(null, 'c:\file.jpg');
    });
    accessStore('default').setState(baseState);
    const { container } = render(
      <PlaneGeometryComponentEditor
        node={{ ...mockNode, components: [componentWithColor] }}
        component={componentWithColor}
      />,
    );
    const polarisWrapper = wrapper(container);
    const selectTextureButton = polarisWrapper.findButton('[data-testid="select-texture-button"]');

    expect(selectTextureButton).toBeDefined();

    // click checkbox should update store
    act(() => {
      selectTextureButton!.click();
    });
    expect(showAssetBrowserCallbackMock).toBeCalledTimes(1);
    const { color: _color, ...otherComponentProps } = componentWithColor;
    expect(updateComponentInternalFn).toBeCalledWith(
      mockNode.ref,
      { ...otherComponentProps, textureUri: 'c:\file.jpg' },
      true,
    );
  });

  it('should remove texture', () => {
    const globalSettingsMock = getGlobalSettings as vi.Mock;
    globalSettingsMock.mockReturnValue({ featureConfig: mockFeatureConfigOn });

    accessStore('default').setState(baseState);
    const { container } = render(
      <PlaneGeometryComponentEditor
        node={{ ...mockNode, components: [componentWithTexturedPlane] }}
        component={componentWithTexturedPlane}
      />,
    );
    const polarisWrapper = wrapper(container);
    const removeTextureButton = polarisWrapper.findButton('[data-testid="remove-texture-button"]');

    expect(removeTextureButton).toBeDefined();

    // click checkbox should update store
    act(() => {
      removeTextureButton!.click();
    });

    expect(updateComponentInternalFn).toBeCalledTimes(1);
    const { textureUri: _textureUri, ...otherComponentProps } = componentWithTexturedPlane;
    expect(updateComponentInternalFn).toBeCalledWith(mockNode.ref, { ...otherComponentProps, color: '#cccccc' }, true);
  });
});
