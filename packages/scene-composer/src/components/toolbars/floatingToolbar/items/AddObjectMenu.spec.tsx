/* eslint-disable */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import * as THREE from 'three';

const mockIsEnvironmentNode = jest.fn();
jest.doMock('../../../../../src/utils/nodeUtils', () => ({
  createNodeWithTransform: jest.fn(),
  isEnvironmentNode: mockIsEnvironmentNode,
}));

import { AddObjectMenu } from './AddObjectMenu';
import { IColorOverlayComponentInternal, useStore } from '../../../../store';
import {
  COMPOSER_FEATURES,
  DEFAULT_CAMERA_OPTIONS,
  DEFAULT_LIGHT_SETTINGS_MAP,
  IAnchorComponent,
  ICameraComponent,
  IDataOverlayComponent,
  ILightComponent,
  IModelRefComponent,
  IMotionIndicatorComponent,
  KnownComponentType,
  setFeatureConfig,
  setMetricRecorder,
} from '../../../..';
import { Component, LightType } from '../../../../models/SceneModels';
import { createNodeWithTransform } from '../../../../utils/nodeUtils';
/* eslint-enable */

jest.mock('../../../../../src/utils/pathUtils', () => ({
  extractFileNameExtFromUrl: jest.fn().mockReturnValue(['filename', 'ext']),
}));

describe('AddObjectMenu', () => {
  const addComponentInternal = jest.fn();
  const appendSceneNode = jest.fn();
  const showAssetBrowserCallback = jest.fn();
  const setAddingWidget = jest.fn();
  const selectedSceneNodeRef = 'test-ref';
  const mockMetricRecorder = {
    recordClick: jest.fn(),
  };
  const mainCameraObject = new THREE.PerspectiveCamera();
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
      setAddingWidget,
      mainCameraObject,
    } as any);
    jest.clearAllMocks();

    setFeatureConfig({ [COMPOSER_FEATURES.CameraView]: true, [COMPOSER_FEATURES.EnvironmentModel]: true });
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

  it('should call appendSceneNode when adding a camera', () => {
    const cameraComponent: ICameraComponent = {
      cameraType: 'Perspective',
      type: 'Camera',
      fov: DEFAULT_CAMERA_OPTIONS.fov,
      far: DEFAULT_CAMERA_OPTIONS.far,
      near: DEFAULT_CAMERA_OPTIONS.near,
      zoom: 1,
    };

    const transform = {
      position: [0, 0, 0],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
    };

    const node = {
      name: 'Camera',
      components: [cameraComponent],
      parentRef: selectedSceneNodeRef,
      transform,
    };

    (createNodeWithTransform as jest.Mock).mockReturnValue(node);

    render(<AddObjectMenu />);
    const sut = screen.getByTestId('add-object-view-camera');
    fireEvent.pointerUp(sut);

    expect(appendSceneNode).toBeCalledWith(node);
    expect(mockMetricRecorder.recordClick).toBeCalledTimes(1);
    expect(mockMetricRecorder.recordClick).toBeCalledWith('add-object-view-camera');
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

  it('should call appendSceneNode when adding an environment model', () => {
    const gltfComponent: IModelRefComponent = {
      type: 'ModelRef',
      uri: 'modelUri',
      modelType: 'Environment',
    };
    showAssetBrowserCallback.mockImplementationOnce((callback) => callback(null, 'modelUri'));

    render(<AddObjectMenu />);
    const sut = screen.getByTestId('add-environment-model');
    fireEvent.pointerUp(sut);
    expect(appendSceneNode).toBeCalledWith({
      name: 'filename',
      components: [gltfComponent],
      parentRef: undefined,
    });
    expect(mockMetricRecorder.recordClick).toBeCalledTimes(1);
    expect(mockMetricRecorder.recordClick).toBeCalledWith('add-environment-model');
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

  it('should not see add overlay item when feature is not enabled', () => {
    setFeatureConfig({ [COMPOSER_FEATURES.Overlay]: false });

    render(<AddObjectMenu />);

    expect(screen.queryByTestId('add-overlay-menu')).toBeNull();
  });

  it('should call setAddingWidget when adding a annotation', () => {
    setFeatureConfig({ [COMPOSER_FEATURES.Overlay]: true, [COMPOSER_FEATURES.ENHANCED_EDITING]: true });
    const component: IDataOverlayComponent = {
      type: KnownComponentType.DataOverlay,
      valueDataBindings: [],
      subType: Component.DataOverlaySubType.TextAnnotation,
      dataRows: [
        {
          rowType: Component.DataOverlayRowType.Markdown,
          content: '',
        },
      ],
    };

    render(<AddObjectMenu />);
    const sut = screen.getByTestId('add-object-annotation');
    fireEvent.pointerUp(sut);
    expect(setAddingWidget).toBeCalledWith({
      type: KnownComponentType.DataOverlay,
      node: {
        name: 'Annotation',
        components: [component],
        parentRef: selectedSceneNodeRef,
      },
    });
    expect(mockMetricRecorder.recordClick).toBeCalledTimes(1);
    expect(mockMetricRecorder.recordClick).toBeCalledWith('add-object-annotation');
  });
});
