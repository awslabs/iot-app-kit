import React, { useCallback, useContext, useMemo } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import * as THREE from 'three';

import { DEFAULT_LIGHT_SETTINGS_MAP } from '../../../../common/constants';
import {
  COMPOSER_FEATURES,
  IAnchorComponent,
  ICameraComponent,
  ILightComponent,
  IModelRefComponent,
  IMotionIndicatorComponent,
  KnownComponentType,
} from '../../../../interfaces';
import { sceneComposerIdContext } from '../../../../common/sceneComposerIdContext';
import { Component, LightType, ModelType } from '../../../../models/SceneModels';
import { IColorOverlayComponentInternal, ISceneNodeInternal, useEditorState, useStore } from '../../../../store';
import { extractFileNameExtFromUrl, parseS3BucketFromArn } from '../../../../utils/pathUtils';
import { ToolbarItem } from '../../common/ToolbarItem';
import { ToolbarItemOptions } from '../../common/types';
import { getGlobalSettings } from '../../../../common/GlobalSettings';
import useActiveCamera from '../../../../hooks/useActiveCamera';
import { createNodeWithTransform, findComponentByType, isEnvironmentNode } from '../../../../utils/nodeUtils';

// Note: ObjectType String is used to record metric. DO NOT change existing ids unless it's necessary.
enum ObjectTypes {
  Object = 'add-object',
  Tag = 'add-object-tag',
  Empty = 'add-object-empty',
  Model = 'add-object-model',
  EnvironmentModel = 'add-environment-model',
  ModelShader = 'add-effect-model-shader',
  MotionIndicator = 'add-object-motion-indicator',
  Light = 'add-object-light',
  ViewCamera = 'add-object-view-camera',
}

type AddObjectMenuItem = ToolbarItemOptions & {
  uuid: ObjectTypes;
};

const labelStrings = defineMessages({
  [ObjectTypes.Object]: { defaultMessage: 'Add object', description: 'Menu Item label' },
  [ObjectTypes.Tag]: { defaultMessage: 'Tag', description: 'Menu Item label' },
  [ObjectTypes.Empty]: { defaultMessage: 'Empty node', description: 'Menu Item label' },
  [ObjectTypes.Model]: { defaultMessage: '3D model', description: 'Menu Item label' },
  [ObjectTypes.EnvironmentModel]: { defaultMessage: 'Environment model', description: 'Menu Item label' },
  [ObjectTypes.Light]: { defaultMessage: 'Light', description: 'Menu Item label' },
  [ObjectTypes.ModelShader]: { defaultMessage: 'Model shader', description: 'Menu Item label' },
  [ObjectTypes.MotionIndicator]: { defaultMessage: 'Motion indicator', description: 'Menu Item label' },
  [ObjectTypes.ViewCamera]: { defaultMessage: 'Camera', description: 'Menu Item label' },
});

const textStrings = defineMessages({
  [ObjectTypes.Tag]: { defaultMessage: 'Add tag', description: 'Menu Item' },
  [ObjectTypes.Empty]: { defaultMessage: 'Add empty node', description: 'Menu Item' },
  [ObjectTypes.Model]: { defaultMessage: 'Add 3D model', description: 'Menu Item' },
  [ObjectTypes.EnvironmentModel]: { defaultMessage: 'Add Environment model', description: 'Menu Item' },
  [ObjectTypes.Light]: { defaultMessage: 'Add light', description: 'Menu Item' },
  [ObjectTypes.ModelShader]: { defaultMessage: 'Add model shader', description: 'Menu Item' },
  [ObjectTypes.MotionIndicator]: { defaultMessage: 'Add motion indicator', description: 'Menu Item' },
  [ObjectTypes.ViewCamera]: { defaultMessage: 'Add camera from current view', description: 'Menu Item' },
});

export const AddObjectMenu = () => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const addComponentInternal = useStore(sceneComposerId)((state) => state.addComponentInternal);
  const appendSceneNode = useStore(sceneComposerId)((state) => state.appendSceneNode);
  const selectedSceneNodeRef = useStore(sceneComposerId)((state) => state.selectedSceneNodeRef);
  const showAssetBrowserCallback = useStore(sceneComposerId)(
    (state) => state.getEditorConfig().showAssetBrowserCallback,
  );
  const getSceneNodeByRef = useStore(sceneComposerId)((state) => state.getSceneNodeByRef);
  const nodeMap = useStore(sceneComposerId)((state) => state.document.nodeMap);
  const { setAddingWidget, getObject3DBySceneNodeRef } = useEditorState(sceneComposerId);
  const enhancedEditingEnabled = getGlobalSettings().featureConfig[COMPOSER_FEATURES.ENHANCED_EDITING];
  const { formatMessage } = useIntl();
  const { activeCameraSettings, mainCameraObject } = useActiveCamera();

  const selectedSceneNode = useMemo(() => {
    return getSceneNodeByRef(selectedSceneNodeRef);
  }, [selectedSceneNodeRef]);

  const sceneContainsEnvironmentModel = useMemo(() => {
    return (
      Object.values(nodeMap).filter((node) => {
        const modelComponent = findComponentByType(node, KnownComponentType.ModelRef) as IModelRefComponent;
        return modelComponent && modelComponent.modelType === ModelType.Environment;
      }).length > 0
    );
  }, [nodeMap]);

  const addObjectMenuItems = [
    {
      icon: { name: 'add-plus' },
      uuid: ObjectTypes.Object,
    },
    {
      uuid: ObjectTypes.Empty,
    },
    {
      uuid: ObjectTypes.Model,
      isDisabled: !showAssetBrowserCallback,
    },
    {
      uuid: ObjectTypes.EnvironmentModel,
      isDisabled: !showAssetBrowserCallback || sceneContainsEnvironmentModel,
      feature: { name: COMPOSER_FEATURES.EnvironmentModel },
    },
    {
      uuid: ObjectTypes.Light,
    },
    {
      uuid: ObjectTypes.ViewCamera,
      feature: { name: COMPOSER_FEATURES.CameraView },
    },
    {
      uuid: ObjectTypes.Tag,
    },
    {
      uuid: ObjectTypes.ModelShader,
      isDisabled: !selectedSceneNodeRef || isEnvironmentNode(selectedSceneNode),
    },
    {
      uuid: ObjectTypes.MotionIndicator,
    },
  ].map(
    (item) =>
      ({
        ...item,
        label: labelStrings[item.uuid] ? formatMessage(labelStrings[item.uuid]) : undefined, // If there's a label string, show label
        text: textStrings[item.uuid] ? formatMessage(textStrings[item.uuid]) : undefined, // if there's a text string, show text
      } as AddObjectMenuItem),
  );

  const getRefForParenting = useCallback(() => {
    return !isEnvironmentNode(selectedSceneNode) ? selectedSceneNodeRef : undefined;
  }, [getSceneNodeByRef, selectedSceneNodeRef, selectedSceneNode]);

  const handleAddAnchor = useCallback(() => {
    const anchorComponent: IAnchorComponent = {
      type: 'Tag',
    };
    const node = {
      name: 'Tag',
      components: [anchorComponent],
      parentRef: getRefForParenting(),
    } as ISceneNodeInternal;
    if (enhancedEditingEnabled) {
      setAddingWidget({ type: KnownComponentType.Tag, node });
    } else {
      appendSceneNode(node);
    }
  }, [enhancedEditingEnabled]);

  const handleAddColorOverlay = () => {
    // Requires a selected scene node
    if (!selectedSceneNodeRef || isEnvironmentNode(selectedSceneNode)) return;

    const colorOverlayComponent: IColorOverlayComponentInternal = {
      ref: THREE.MathUtils.generateUUID(),
      type: 'ModelShader',
    };

    addComponentInternal(selectedSceneNodeRef, colorOverlayComponent);
  };

  const handleAddEmpty = () => {
    const node = {
      name: 'Node',
      parentRef: getRefForParenting(),
    } as unknown as ISceneNodeInternal;

    appendSceneNode(node);
  };

  const handleAddLight = () => {
    const lightComponent: ILightComponent = {
      type: 'Light',
      lightType: LightType.Directional,
      lightSettings: DEFAULT_LIGHT_SETTINGS_MAP[LightType.Directional],
    };

    appendSceneNode({
      name: 'Light',
      components: [lightComponent],
      parentRef: getRefForParenting(),
    });
  };

  const handleAddViewCamera = () => {
    if (mainCameraObject) {
      const cameraComponent: ICameraComponent = {
        cameraType: activeCameraSettings.cameraType,
        type: 'Camera',
        fov: activeCameraSettings.fov,
        far: activeCameraSettings.far,
        near: activeCameraSettings.near,
        zoom: activeCameraSettings.zoom,
      };

      // Find how many cameras we have for unique name
      const currentCount =
        Object.values(nodeMap).filter((node) => findComponentByType(node, KnownComponentType.Camera)).length + 1;

      const node = {
        name: `Camera${currentCount}`,
        components: [cameraComponent],
        parentRef: getRefForParenting(),
      } as unknown as ISceneNodeInternal;

      const parent = getObject3DBySceneNodeRef(node.parentRef);
      const newNode = createNodeWithTransform(
        node,
        mainCameraObject.position,
        mainCameraObject.rotation,
        mainCameraObject.scale,
        parent,
      );

      appendSceneNode(newNode);
    }
  };

  const handleAddModel = (modelType?: string, mustBeRoot = false) => {
    if (showAssetBrowserCallback) {
      showAssetBrowserCallback((s3BucketArn, contentLocation) => {
        const [filename, ext] = extractFileNameExtFromUrl(contentLocation);

        let modelUri: string;
        if (s3BucketArn === null) {
          // This should be used for local testing only
          modelUri = contentLocation;
        } else {
          modelUri = `s3://${parseS3BucketFromArn(s3BucketArn)}/${contentLocation}`;
        }

        const gltfComponent: IModelRefComponent = {
          type: 'ModelRef',
          uri: modelUri,
          modelType: modelType ?? ext.toUpperCase(),
        };

        const node = {
          name: filename,
          components: [gltfComponent],
          parentRef: mustBeRoot ? undefined : getRefForParenting(),
        } as unknown as ISceneNodeInternal;

        if (enhancedEditingEnabled && !modelType) {
          setAddingWidget({ type: KnownComponentType.ModelRef, node });
        } else {
          appendSceneNode(node);
        }
      });
    }
  };

  const handleAddMotionIndicator = () => {
    const motionIndicatorComponent: IMotionIndicatorComponent = {
      type: 'MotionIndicator',
      shape: Component.MotionIndicatorShape.LinearPlane,
      valueDataBindings: {},
      config: {
        numOfRepeatInY: 1,
        backgroundColorOpacity: 1,
      },
    };

    const node = {
      name: 'MotionIndicator',
      components: [motionIndicatorComponent],
      parentRef: getRefForParenting(),
    } as unknown as ISceneNodeInternal;

    if (enhancedEditingEnabled) {
      setAddingWidget({ type: KnownComponentType.MotionIndicator, node });
    } else {
      appendSceneNode(node);
    }
  };

  return (
    <ToolbarItem
      items={addObjectMenuItems}
      type='action-select'
      onClick={({ uuid }) => {
        switch (uuid) {
          case ObjectTypes.Tag:
            handleAddAnchor();
            break;
          case ObjectTypes.ModelShader:
            handleAddColorOverlay();
            break;
          case ObjectTypes.Empty:
            handleAddEmpty();
            break;
          case ObjectTypes.Light:
            handleAddLight();
            break;
          case ObjectTypes.Model:
            handleAddModel();
            break;
          case ObjectTypes.EnvironmentModel:
            handleAddModel(ModelType.Environment, true);
            break;
          case ObjectTypes.MotionIndicator:
            handleAddMotionIndicator();
            break;
          case ObjectTypes.ViewCamera:
            handleAddViewCamera();
            break;
        }

        getGlobalSettings().metricRecorder?.recordClick(uuid);
      }}
    />
  );
};
