import wrapper from '@awsui/components-react/test-utils/dom';
import { act, render } from '@testing-library/react';
import React from 'react';

import { getGlobalSettings } from '../../../common/GlobalSettings';
import { IPlaneGeometryComponentInternal, useStore } from '../../../store';
import { KnownComponentType, COMPOSER_FEATURES } from '../../../interfaces';
import { mockNode, mockComponent } from '../../../../tests/components/panels/scene-components/MockComponents';

import { PlaneGeometryComponentEditor } from './PlaneGeometryComponentEditor';

jest.mock('../../../common/GlobalSettings');

jest.mock('@awsui/components-react', () => ({
  ...jest.requireActual('@awsui/components-react'),
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

  const componentWithTexturedGroundPlane: IPlaneGeometryComponentInternal = {
    ...mockComponent,
    type: KnownComponentType.PlaneGeometry,
    width: 10,
    height: 20,
    textureUri: 'filepath',
    isGroundPlane: true,
  };

  const mockFeatureConfigOn = { [COMPOSER_FEATURES.Textures]: true };

  const updateComponentInternalFn = jest.fn();
  const showAssetBrowserCallbackMock = jest.fn();
  const baseState = {
    updateComponentInternal: updateComponentInternalFn,
    getEditorConfig: () => ({
      showAssetBrowserCallback: showAssetBrowserCallbackMock,
    }),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should update width when width changes', () => {
    const globalSettingsMock = getGlobalSettings as jest.Mock;
    globalSettingsMock.mockReturnValue({ featureConfig: mockFeatureConfigOn });
    useStore('default').setState(baseState);
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
    const globalSettingsMock = getGlobalSettings as jest.Mock;
    globalSettingsMock.mockReturnValue({ featureConfig: mockFeatureConfigOn });

    useStore('default').setState(baseState);
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
    const globalSettingsMock = getGlobalSettings as jest.Mock;
    globalSettingsMock.mockReturnValue({ featureConfig: mockFeatureConfigOn });

    useStore('default').setState(baseState);
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
    const globalSettingsMock = getGlobalSettings as jest.Mock;
    globalSettingsMock.mockReturnValue({ featureConfig: mockFeatureConfigOn });

    showAssetBrowserCallbackMock.mockImplementation((cb) => {
      cb(null, 'c:\file.jpg');
    });
    useStore('default').setState(baseState);
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
    const globalSettingsMock = getGlobalSettings as jest.Mock;
    globalSettingsMock.mockReturnValue({ featureConfig: mockFeatureConfigOn });

    useStore('default').setState(baseState);
    const { container } = render(
      <PlaneGeometryComponentEditor
        node={{ ...mockNode, components: [componentWithTexturedGroundPlane] }}
        component={componentWithTexturedGroundPlane}
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
    const { textureUri: _textureUri, ...otherComponentProps } = componentWithTexturedGroundPlane;
    expect(updateComponentInternalFn).toBeCalledWith(mockNode.ref, { ...otherComponentProps, color: '#cccccc' }, true);
  });

  it('should toggle ground plane status', () => {
    const globalSettingsMock = getGlobalSettings as jest.Mock;
    globalSettingsMock.mockReturnValue({ featureConfig: mockFeatureConfigOn });
    useStore('default').setState(baseState);
    const { container } = render(
      <PlaneGeometryComponentEditor node={{ ...mockNode, components: [component] }} component={component} />,
    );
    const polarisWrapper = wrapper(container);
    const groundPlaneCheckBox = polarisWrapper.findCheckbox('[data-testid="ground-plane-checkbox"]');

    expect(groundPlaneCheckBox).toBeDefined();

    // click checkbox should update store
    act(() => {
      groundPlaneCheckBox?.findNativeInput().click();
    });
    expect(updateComponentInternalFn).toBeCalledTimes(1);
    expect(updateComponentInternalFn).toBeCalledWith(mockNode.ref, { ...component, isGroundPlane: true }, true);

    act(() => {
      groundPlaneCheckBox?.findNativeInput().click();
    });
    expect(updateComponentInternalFn).toBeCalledWith(mockNode.ref, { ...component, isGroundPlane: false }, true);
  });
});
