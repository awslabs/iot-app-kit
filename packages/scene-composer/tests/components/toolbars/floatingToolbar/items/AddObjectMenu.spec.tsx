/* eslint-disable */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { mockReactIntl } from '../../../../__mocks__/MockReactIntl';
mockReactIntl();

import { AddObjectMenu } from '../../../../../src/components/toolbars/floatingToolbar/items/AddObjectMenu';
import { IColorOverlayComponentInternal, useStore } from '../../../../../src/store';
import {
  COMPOSER_FEATURES,
  DEFAULT_LIGHT_SETTINGS_MAP,
  IAnchorComponent,
  ILightComponent,
  IModelRefComponent,
  IMotionIndicatorComponent,
  KnownComponentType,
  setFeatureConfig,
  setMetricRecorder,
} from '../../../../../src';
import { Component, LightType } from '../../../../../src/SceneModels';
/* eslint-enable */

jest.mock('../../../../../src/utils/pathUtils', () => ({
  extractFileNameExtFromUrl: jest.fn().mockReturnValue(['filename', 'ext']),
}));

describe('AddObjectMenu', () => {
  const addComponentInternal = jest.fn();
  const appendSceneNode = jest.fn();
  const showAssetBrowserCallback = jest.fn();
  const selectedSceneNodeRef = 'test-ref';
  const mockMetricRecorder = {
    recordClick: jest.fn(),
  };
  setMetricRecorder(mockMetricRecorder);

  beforeEach(() => {
    jest.clearAllMocks();

    useStore('default').setState({
      selectedSceneNodeRef,
      addComponentInternal,
      appendSceneNode,
      getEditorConfig: () => ({
        showAssetBrowserCallback,
      }),
    } as any);
    jest.clearAllMocks();

    setFeatureConfig({});
  });

  it('should call appendSceneNode when adding a light', () => {
    const lightComponent: ILightComponent = {
      type: 'Light',
      lightType: LightType.Directional,
      lightSettings: DEFAULT_LIGHT_SETTINGS_MAP[LightType.Directional],
    };

    render(<AddObjectMenu />);
    const sut = screen.getByTestId('add-object-light');
    fireEvent.pointerUp(sut);
    expect(appendSceneNode).toBeCalledWith({
      name: 'Light',
      components: [lightComponent],
      parentRef: selectedSceneNodeRef,
    });
    expect(mockMetricRecorder.recordClick).toBeCalledTimes(1);
    expect(mockMetricRecorder.recordClick).toBeCalledWith('add-object-light');
  });

  it('should call appendSceneNode when adding a tag', () => {
    const anchorComponent: IAnchorComponent = {
      type: 'Tag',
    };

    render(<AddObjectMenu />);
    const sut = screen.getByTestId('add-object-tag');
    fireEvent.pointerUp(sut);
    expect(appendSceneNode).toBeCalledWith({
      name: 'Tag',
      components: [anchorComponent],
      parentRef: selectedSceneNodeRef,
    });
    expect(mockMetricRecorder.recordClick).toBeCalledTimes(1);
    expect(mockMetricRecorder.recordClick).toBeCalledWith('add-object-tag');
  });

  it('should call appendSceneNode when adding an empty node', () => {
    render(<AddObjectMenu />);
    const sut = screen.getByTestId('add-object-empty');
    fireEvent.pointerUp(sut);
    expect(appendSceneNode).toBeCalledWith({
      name: 'Node',
      parentRef: selectedSceneNodeRef,
    });
    expect(mockMetricRecorder.recordClick).toBeCalledTimes(1);
    expect(mockMetricRecorder.recordClick).toBeCalledWith('add-object-empty');
  });

  it('should call appendSceneNode when adding a model', () => {
    const gltfComponent: IModelRefComponent = {
      type: 'ModelRef',
      uri: 'modelUri',
      modelType: 'EXT',
    };
    showAssetBrowserCallback.mockImplementationOnce((callback) => callback(null, 'modelUri'));

    render(<AddObjectMenu />);
    const sut = screen.getByTestId('add-object-model');
    fireEvent.pointerUp(sut);
    expect(appendSceneNode).toBeCalledWith({
      name: 'filename',
      components: [gltfComponent],
      parentRef: selectedSceneNodeRef,
    });
    expect(mockMetricRecorder.recordClick).toBeCalledTimes(1);
    expect(mockMetricRecorder.recordClick).toBeCalledWith('add-object-model');
  });

  it('should call addComponentInternal when adding a model shader', () => {
    const colorOverlayComponent: IColorOverlayComponentInternal = {
      ref: expect.any(String),
      type: 'ModelShader',
    };

    render(<AddObjectMenu />);
    const sut = screen.getByTestId('add-effect-model-shader');
    fireEvent.pointerUp(sut);
    expect(addComponentInternal).toBeCalledWith(selectedSceneNodeRef, colorOverlayComponent);
    expect(mockMetricRecorder.recordClick).toBeCalledTimes(1);
    expect(mockMetricRecorder.recordClick).toBeCalledWith('add-effect-model-shader');
  });

  it('should call appendSceneNode when adding a motion indicator', () => {
    // not enabled
    render(<AddObjectMenu />);
    expect(screen.queryByTestId('add-object-motion-indicator')).toBeNull();

    // enabled
    setFeatureConfig({ [COMPOSER_FEATURES.MOTION_INDICATOR]: true });
    const motionIndicatorComponent: IMotionIndicatorComponent = {
      type: KnownComponentType.MotionIndicator,
      valueDataBindings: {},
      shape: Component.MotionIndicatorShape.LinearPlane,
      config: {
        numOfRepeatInY: 1,
        backgroundColorOpacity: 1,
      },
    };

    render(<AddObjectMenu />);
    const sut = screen.getByTestId('add-object-motion-indicator');
    fireEvent.pointerUp(sut);
    expect(appendSceneNode).toBeCalledWith({
      name: 'MotionIndicator',
      components: [motionIndicatorComponent],
      parentRef: selectedSceneNodeRef,
    });
    expect(mockMetricRecorder.recordClick).toBeCalledTimes(1);
    expect(mockMetricRecorder.recordClick).toBeCalledWith('add-object-motion-indicator');
  });
});
