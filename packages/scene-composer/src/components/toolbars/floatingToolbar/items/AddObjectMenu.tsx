import React, { useCallback, useContext, useMemo } from 'react';
import { defineMessages, MessageDescriptor, useIntl } from 'react-intl';
import * as THREE from 'three';
import { IconProps } from '@awsui/components-react';

import { getSceneResourceDefaultValue } from '../../../../utils/sceneResourceUtils';
import { DEFAULT_LIGHT_SETTINGS_MAP } from '../../../../common/constants';
import {
  COMPOSER_FEATURES,
  IAnchorComponent,
  ICameraComponent,
  IDataOverlayComponent,
  ILightComponent,
  IModelRefComponent,
  IMotionIndicatorComponent,
  ISceneNode,
  KnownComponentType,
  SceneResourceType,
  IPlaneGeometryComponent,
} from '../../../../interfaces';
import { sceneComposerIdContext } from '../../../../common/sceneComposerIdContext';
import { Component, LightType, ModelType } from '../../../../models/SceneModels';
import { IColorOverlayComponentInternal, ISceneNodeInternal, useEditorState, useStore } from '../../../../store';
import { extractFileNameExtFromUrl, parseS3BucketFromArn } from '../../../../utils/pathUtils';
import { ToolbarItem } from '../../common/ToolbarItem';
import { ToolbarItemOptionRaw, ToolbarItemOptions, ToolbarOrientation } from '../../common/types';
import { getGlobalSettings } from '../../../../common/GlobalSettings';
import useActiveCamera from '../../../../hooks/useActiveCamera';
import useMatterportViewer from '../../../../hooks/useMatterportViewer';
import { createNodeWithTransform, findComponentByType, isEnvironmentNode } from '../../../../utils/nodeUtils';
import { FLOATING_TOOLBAR_VERTICAL_ORIENTATION_BUFFER } from '../FloatingToolbar';
import { TOOLBAR_ITEM_CONTAINER_HEIGHT } from '../../common/styledComponents';
import { isDynamicScene } from '../../../../utils/entityModelUtils/sceneUtils';

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
  Annotation = 'add-object-annotation',
  GroundPlane = 'add-object-ground-plane',
}

type AddObjectMenuItem = ToolbarItemOptions & {
  uuid: ObjectTypes;
};

const labelStrings: { [key in ObjectTypes]: MessageDescriptor } = defineMessages({
  [ObjectTypes.Object]: { defaultMessage: 'Add object', description: 'Menu Item label' },
  [ObjectTypes.Tag]: { defaultMessage: 'Tag', description: 'Menu Item label' },
  [ObjectTypes.Empty]: { defaultMessage: 'Empty node', description: 'Menu Item label' },
  [ObjectTypes.Model]: { defaultMessage: '3D model', description: 'Menu Item label' },
  [ObjectTypes.EnvironmentModel]: { defaultMessage: 'Environment model', description: 'Menu Item label' },
  [ObjectTypes.Light]: { defaultMessage: 'Light', description: 'Menu Item label' },
  [ObjectTypes.ModelShader]: { defaultMessage: 'Model shader', description: 'Menu Item label' },
  [ObjectTypes.MotionIndicator]: { defaultMessage: 'Motion indicator', description: 'Menu Item label' },
  [ObjectTypes.ViewCamera]: { defaultMessage: 'Camera', description: 'Menu Item label' },
  [ObjectTypes.Annotation]: { defaultMessage: 'Annotation', description: 'Menu Item label' },
  [ObjectTypes.GroundPlane]: { defaultMessage: 'Ground Plane', description: 'Menu Item label' },
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
  [ObjectTypes.Annotation]: { defaultMessage: 'Add annotation', description: 'Menu Item' },
  [ObjectTypes.GroundPlane]: { defaultMessage: 'Add ground plane', description: 'Menu Item' },
});

interface AddObjectMenuProps {
  canvasHeight: number | undefined;
  toolbarOrientation: ToolbarOrientation;
}

export const AddObjectMenu = ({ canvasHeight, toolbarOrientation }: AddObjectMenuProps): JSX.Element => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const addComponentInternal = useStore(sceneComposerId)((state) => state.addComponentInternal);
  const appendSceneNode = useStore(sceneComposerId)((state) => state.appendSceneNode);
  const selectedSceneNodeRef = useStore(sceneComposerId)((state) => state.selectedSceneNodeRef);
  const showAssetBrowserCallback = useStore(sceneComposerId)(
    (state) => state.getEditorConfig().showAssetBrowserCallback,
  );
  const getSceneNodeByRef = useStore(sceneComposerId)((state) => state.getSceneNodeByRef);
  const document = useStore(sceneComposerId)((state) => state.document);
  const nodeMap = useStore(sceneComposerId)((state) => state.document.nodeMap);
  const { setAddingWidget, getObject3DBySceneNodeRef } = useEditorState(sceneComposerId);
  const { enableMatterportViewer } = useMatterportViewer();
  const enhancedEditingEnabled = getGlobalSettings().featureConfig[COMPOSER_FEATURES.ENHANCED_EDITING];
  const { formatMessage } = useIntl();
  const { activeCameraSettings, mainCameraObject } = useActiveCamera();
  const dynamicSceneEnabled = getGlobalSettings().featureConfig[COMPOSER_FEATURES.DynamicScene];

  const selectedSceneNode = useMemo(() => {
    return getSceneNodeByRef(selectedSceneNodeRef);
  }, [getSceneNodeByRef, selectedSceneNodeRef]);

  const sceneContainsEnvironmentModel = useMemo(() => {
    return (
      Object.values(nodeMap).filter((node) => {
        const modelComponent = findComponentByType(node, KnownComponentType.ModelRef) as IModelRefComponent;
        return modelComponent && modelComponent.modelType === ModelType.Environment;
      }).length > 0
    );
  }, [nodeMap]);

  const mapToMenuItem = useCallback(
    (item: ToolbarItemOptionRaw): AddObjectMenuItem => {
      const typeId: ObjectTypes = item.uuid as ObjectTypes;
      return {
        ...item,
        uuid: typeId,
        subItems: item.subItems?.map(mapToMenuItem),
        label: formatMessage(labelStrings[typeId]),
        text: textStrings[typeId] ? formatMessage(textStrings[typeId]) : undefined, // if there's a text string, show text
      };
    },
    [formatMessage],
  );

  const addObjectMenuItems = useMemo(
    () =>
      [
        {
          icon: { name: 'add-plus' as IconProps.Name },
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
          isDisabled: enableMatterportViewer,
        },
        {
          uuid: ObjectTypes.Tag,
        },
        {
          uuid: ObjectTypes.Annotation,
          feature: { name: COMPOSER_FEATURES.Overlay },
        },
        {
          uuid: ObjectTypes.ModelShader,
          isDisabled: !selectedSceneNodeRef || isEnvironmentNode(selectedSceneNode),
        },
        {
          uuid: ObjectTypes.MotionIndicator,
        },
        {
          uuid: ObjectTypes.GroundPlane,
          feature: { name: COMPOSER_FEATURES.SceneAppearance },
        },
      ].map(mapToMenuItem),
    [
      showAssetBrowserCallback,
      sceneContainsEnvironmentModel,
      selectedSceneNodeRef,
      isEnvironmentNode,
      enableMatterportViewer,
    ],
  );

  const getRefForParenting = useCallback(() => {
    return !isEnvironmentNode(selectedSceneNode) ? selectedSceneNodeRef : undefined;
  }, [selectedSceneNodeRef, selectedSceneNode]);

  const handleAddAnchor = useCallback(() => {
    const type = SceneResourceType.Icon;
    const anchorComponent: IAnchorComponent = {
      icon: getSceneResourceDefaultValue(type),
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
  }, [enhancedEditingEnabled, getRefForParenting, appendSceneNode, setAddingWidget]);

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
    const node: ISceneNode = {
      name: 'Node',
      parentRef: getRefForParenting(),
    };

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
        type: KnownComponentType.Camera,
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
        // Use correct parentRef when dynamic scene supports parent-child relationship
        parentRef: dynamicSceneEnabled && isDynamicScene(document) ? undefined : getRefForParenting(),
      } as unknown as ISceneNodeInternal;

      let physicalParentNode: ISceneNodeInternal | undefined = getSceneNodeByRef(node.parentRef);
      while (physicalParentNode && findComponentByType(physicalParentNode, KnownComponentType.SubModelRef)) {
        physicalParentNode = getSceneNodeByRef(physicalParentNode.parentRef);
      }

      const hierarchicalParentRef = node.parentRef;
      const parent = physicalParentNode ? getObject3DBySceneNodeRef(physicalParentNode.ref) : undefined;
      const newNode = createNodeWithTransform(
        node,
        mainCameraObject.position,
        mainCameraObject.rotation,
        mainCameraObject.scale,
        parent,
        hierarchicalParentRef,
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

  const handleAddGroundPlane = () => {
    const planeComponent: IPlaneGeometryComponent = {
      type: 'PlaneGeometry',
      width: 1000,
      height: 1000,
      color: 'green',
      isGroundPlane: true,
    };
    const node = {
      name: 'Ground Plane',
      components: [planeComponent],
      parentRef: undefined, //force to root
    } as unknown as ISceneNodeInternal;
    const newNode = createNodeWithTransform(
      node,
      new THREE.Vector3(0, -0.001, 0), //position
      new THREE.Euler(Math.PI / 2, 0, 0), //rotation on X 90 degrees to place in X-Z plane instead of X-Y plane
      new THREE.Vector3(1, 1, 1), //scale
    );
    appendSceneNode(newNode);
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

  const handleAddOverlay = useCallback(
    (subType: Component.DataOverlaySubType) => {
      const component: IDataOverlayComponent = {
        type: KnownComponentType.DataOverlay,
        subType,
        valueDataBindings: [],
        dataRows: [
          {
            rowType: Component.DataOverlayRowType.Markdown,
            content: '',
          },
        ],
      };

      const node = {
        name: subType === Component.DataOverlaySubType.OverlayPanel ? 'DataOverlay' : 'Annotation',
        components: [component],
        parentRef: getRefForParenting(),
      } as unknown as ISceneNodeInternal;

      if (enhancedEditingEnabled) {
        setAddingWidget({ type: KnownComponentType.DataOverlay, node });
      } else {
        appendSceneNode(node);
      }
    },
    [getRefForParenting, enhancedEditingEnabled, setAddingWidget, appendSceneNode],
  );

  return (
    <ToolbarItem
      items={addObjectMenuItems}
      type='action-select'
      onSelect={({ uuid }) => {
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
          case ObjectTypes.Annotation:
            handleAddOverlay(Component.DataOverlaySubType.TextAnnotation);
            break;
          case ObjectTypes.GroundPlane:
            handleAddGroundPlane();
            break;
        }

        getGlobalSettings().metricRecorder?.recordClick(uuid);
      }}
      maxMenuContainerHeight={
        canvasHeight
          ? canvasHeight - FLOATING_TOOLBAR_VERTICAL_ORIENTATION_BUFFER - TOOLBAR_ITEM_CONTAINER_HEIGHT
          : undefined
      }
      isVertical={toolbarOrientation === ToolbarOrientation.Vertical}
      menuPosition={toolbarOrientation === ToolbarOrientation.Vertical ? 'right' : 'bottom-left'}
    />
  );
};
