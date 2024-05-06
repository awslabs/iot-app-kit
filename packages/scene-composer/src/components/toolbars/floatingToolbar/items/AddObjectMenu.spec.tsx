/* eslint-disable */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import * as THREE from 'three';

jest.doMock('../../../../../src/utils/nodeUtils', () => ({
  createNodeWithTransform: jest.fn(),
}));

import { AddObjectMenu } from './AddObjectMenu';
import { IColorOverlayComponentInternal, accessStore } from '../../../../store';
import {
  AssetType,
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
} from '../../../..';
import { CameraType, Component, LightType } from '../../../../models/SceneModels';
import { createNodeWithTransform } from '../../../../utils/nodeUtils';
import { ToolbarOrientation } from '../../common/types';
import { isDynamicScene } from '../../../../utils/entityModelUtils/sceneUtils';
import { TILESET_JSON } from '../../../../utils/sceneAssetUtils';
import { setFeatureConfig, setMetricRecorder } from '../../../../common/GlobalSettings';
/* eslint-enable */

jest.mock('../../../../utils/entityModelUtils/sceneUtils', () => ({
  isDynamicScene: jest.fn(),
}));

describe('AddObjectMenu', () => {
  const addComponentInternal = jest.fn();
  const appendSceneNode = jest.fn();
  const showAssetBrowserCallback = jest.fn();
  const setAddingWidget = jest.fn();
  const addMessages = jest.fn();
  const selectedSceneNodeRef = 'test-ref';
  const mockMetricRecorder = {
    recordClick: jest.fn(),
  };
  const mainCameraObject = new THREE.PerspectiveCamera();
  setMetricRecorder(mockMetricRecorder);

  beforeEach(() => {
    jest.clearAllMocks();

    accessStore('default').setState({
      selectedSceneNodeRef,
      addComponentInternal,
      appendSceneNode,
      getEditorConfig: () => ({
        showAssetBrowserCallback,
      }),
      setAddingWidget,
      mainCameraObject,
      addMessages,
    } as any);
    jest.clearAllMocks();

    setFeatureConfig({
      [COMPOSER_FEATURES.DynamicScene]: true,
    });
  });

  it('should call appendSceneNode when adding a light', () => {
    const lightComponent: ILightComponent = {
      type: 'Light',
      lightType: LightType.Directional,
      lightSettings: DEFAULT_LIGHT_SETTINGS_MAP[LightType.Directional],
    };

    render(<AddObjectMenu canvasHeight={undefined} toolbarOrientation={ToolbarOrientation.Vertical} />);
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
      cameraType: CameraType.Perspective,
      type: 'Camera',
      fov: DEFAULT_CAMERA_OPTIONS.fov,
      far: DEFAULT_CAMERA_OPTIONS.far,
      near: DEFAULT_CAMERA_OPTIONS.near,
      zoom: 1,
    };

    const node = {
      name: 'Camera1',
      components: [cameraComponent],
      parentRef: selectedSceneNodeRef,
    };

    (createNodeWithTransform as jest.Mock).mockImplementation((n) => n);

    render(<AddObjectMenu canvasHeight={undefined} toolbarOrientation={ToolbarOrientation.Vertical} />);
    const sut = screen.getByTestId('add-object-view-camera');
    fireEvent.pointerUp(sut);

    expect(appendSceneNode).toBeCalledWith(node);
    expect(mockMetricRecorder.recordClick).toBeCalledTimes(1);
    expect(mockMetricRecorder.recordClick).toBeCalledWith('add-object-view-camera');
  });

  it('should call appendSceneNode withour parentRef when adding a camera to dynamic scene', () => {
    (isDynamicScene as jest.Mock).mockReturnValue(true);
    const cameraComponent: ICameraComponent = {
      cameraType: CameraType.Perspective,
      type: 'Camera',
      fov: DEFAULT_CAMERA_OPTIONS.fov,
      far: DEFAULT_CAMERA_OPTIONS.far,
      near: DEFAULT_CAMERA_OPTIONS.near,
      zoom: 1,
    };

    const node = {
      name: 'Camera1',
      components: [cameraComponent],
      parentRef: undefined,
    };

    (createNodeWithTransform as jest.Mock).mockImplementation((n) => n);

    render(<AddObjectMenu canvasHeight={undefined} toolbarOrientation={ToolbarOrientation.Vertical} />);
    const sut = screen.getByTestId('add-object-view-camera');
    fireEvent.pointerUp(sut);

    expect(appendSceneNode).toBeCalledWith(node);
    expect(mockMetricRecorder.recordClick).toBeCalledTimes(1);
    expect(mockMetricRecorder.recordClick).toBeCalledWith('add-object-view-camera');
  });

  it('should call setAddingWidget when adding a tag', () => {
    const anchorComponent: IAnchorComponent = {
      icon: 'Info',
      type: 'Tag',
    };

    render(<AddObjectMenu canvasHeight={undefined} toolbarOrientation={ToolbarOrientation.Vertical} />);
    const sut = screen.getByTestId('add-object-tag');
    fireEvent.pointerUp(sut);
    expect(setAddingWidget).toBeCalledWith({
      type: KnownComponentType.Tag,
      node: {
        name: 'Tag',
        components: [anchorComponent],
        parentRef: selectedSceneNodeRef,
      },
    });
    expect(mockMetricRecorder.recordClick).toBeCalledTimes(1);
    expect(mockMetricRecorder.recordClick).toBeCalledWith('add-object-tag');
  });

  it('should call appendSceneNode when adding an empty node', () => {
    render(<AddObjectMenu canvasHeight={undefined} toolbarOrientation={ToolbarOrientation.Vertical} />);
    const sut = screen.getByTestId('add-object-empty');
    fireEvent.pointerUp(sut);
    expect(appendSceneNode).toBeCalledWith({
      name: 'Node',
      parentRef: selectedSceneNodeRef,
    });
    expect(mockMetricRecorder.recordClick).toBeCalledTimes(1);
    expect(mockMetricRecorder.recordClick).toBeCalledWith('add-object-empty');
  });

  it('should call setAddingWidget when adding a model', () => {
    const expectedNodeName = 'modelUri';
    const filename = `${expectedNodeName}.${AssetType.GLTF}`;
    const modelUri = `bucket/assets/${filename}`;
    const gltfComponent: IModelRefComponent = {
      type: KnownComponentType.ModelRef,
      uri: modelUri,
      modelType: AssetType.GLTF,
    };
    showAssetBrowserCallback.mockImplementationOnce((callback) => callback(null, modelUri));

    render(<AddObjectMenu canvasHeight={undefined} toolbarOrientation={ToolbarOrientation.Vertical} />);
    const sut = screen.getByTestId('add-object-model');
    fireEvent.pointerUp(sut);
    expect(setAddingWidget).toBeCalledWith({
      type: KnownComponentType.ModelRef,
      node: {
        name: expectedNodeName,
        components: [gltfComponent],
        parentRef: selectedSceneNodeRef,
      },
    });
    expect(mockMetricRecorder.recordClick).toBeCalledTimes(1);
    expect(mockMetricRecorder.recordClick).toBeCalledWith('add-object-model');
  });

  it('should call setAddingWidget when adding a tiles3d model', () => {
    const expectedNodeName = 'MixerTileset';
    const modelUri = `bucket/assets/${expectedNodeName}/${TILESET_JSON}`;
    const gltfComponent: IModelRefComponent = {
      type: KnownComponentType.ModelRef,
      uri: modelUri,
      modelType: AssetType.TILES_3D,
    };
    showAssetBrowserCallback.mockImplementationOnce((callback) => callback(null, modelUri));

    render(<AddObjectMenu canvasHeight={undefined} toolbarOrientation={ToolbarOrientation.Vertical} />);
    const sut = screen.getByTestId('add-object-model');
    fireEvent.pointerUp(sut);
    expect(setAddingWidget).toBeCalledWith({
      type: KnownComponentType.ModelRef,
      node: {
        name: expectedNodeName,
        components: [gltfComponent],
        parentRef: selectedSceneNodeRef,
      },
    });
    expect(mockMetricRecorder.recordClick).toBeCalledTimes(1);
    expect(mockMetricRecorder.recordClick).toBeCalledWith('add-object-model');
  });

  it('should ignore action and display a message when adding an invalid model type', () => {
    showAssetBrowserCallback.mockImplementationOnce((callback) => callback(null, 'file.invalid'));

    render(<AddObjectMenu canvasHeight={undefined} toolbarOrientation={ToolbarOrientation.Vertical} />);
    const sut = screen.getByTestId('add-object-model');
    fireEvent.pointerUp(sut);
    expect(setAddingWidget).toBeCalledTimes(0);
    expect(addMessages).toBeCalledTimes(1);
  });

  it('should call addComponentInternal when adding a model shader', () => {
    const colorOverlayComponent: IColorOverlayComponentInternal = {
      ref: expect.any(String),
      type: 'ModelShader',
    };

    render(<AddObjectMenu canvasHeight={undefined} toolbarOrientation={ToolbarOrientation.Vertical} />);
    const sut = screen.getByTestId('add-effect-model-shader');
    fireEvent.pointerUp(sut);
    expect(addComponentInternal).toBeCalledWith(selectedSceneNodeRef, colorOverlayComponent);
    expect(mockMetricRecorder.recordClick).toBeCalledTimes(1);
    expect(mockMetricRecorder.recordClick).toBeCalledWith('add-effect-model-shader');
  });

  it('should call setAddingWidget when adding a motion indicator', () => {
    const motionIndicatorComponent: IMotionIndicatorComponent = {
      type: KnownComponentType.MotionIndicator,
      valueDataBindings: {},
      shape: Component.MotionIndicatorShape.LinearPlane,
      config: {
        numOfRepeatInY: 1,
        backgroundColorOpacity: 1,
      },
    };

    render(<AddObjectMenu canvasHeight={undefined} toolbarOrientation={ToolbarOrientation.Vertical} />);
    const sut = screen.getByTestId('add-object-motion-indicator');
    fireEvent.pointerUp(sut);
    expect(setAddingWidget).toBeCalledWith({
      type: KnownComponentType.MotionIndicator,
      node: {
        name: 'MotionIndicator',
        components: [motionIndicatorComponent],
        parentRef: selectedSceneNodeRef,
      },
    });
    expect(mockMetricRecorder.recordClick).toBeCalledTimes(1);
    expect(mockMetricRecorder.recordClick).toBeCalledWith('add-object-motion-indicator');
  });

  it('should call setAddingWidget when adding a annotation', () => {
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

    render(<AddObjectMenu canvasHeight={undefined} toolbarOrientation={ToolbarOrientation.Vertical} />);
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
