import { useCallback, useContext, useMemo } from 'react';
import { defineMessages, type MessageDescriptor, useIntl } from 'react-intl';
import * as THREE from 'three';
import { type IconProps } from '@cloudscape-design/components';

import { getSceneResourceDefaultValue } from '../../../../utils/sceneResourceUtils';
import { DEFAULT_LIGHT_SETTINGS_MAP } from '../../../../common/constants';
import {
  COMPOSER_FEATURES,
  type IAnchorComponent,
  type ICameraComponent,
  type IDataOverlayComponent,
  type ILightComponent,
  type IModelRefComponent,
  type IMotionIndicatorComponent,
  type ISceneNode,
  KnownComponentType,
  SceneResourceType,
  ModelFileTypeList,
} from '../../../../interfaces';
import { sceneComposerIdContext } from '../../../../common/sceneComposerIdContext';
import { Component, LightType } from '../../../../models/SceneModels';
import {
  type IColorOverlayComponentInternal,
  type ISceneNodeInternal,
  useEditorState,
  accessStore,
} from '../../../../store';
import { parseS3BucketFromArn } from '../../../../utils/pathUtils';
import { ToolbarItem } from '../../common/ToolbarItem';
import { type ToolbarItemOptionRaw, type ToolbarItemOptions, ToolbarOrientation } from '../../common/types';
import { getGlobalSettings } from '../../../../common/GlobalSettings';
import useActiveCamera from '../../../../hooks/useActiveCamera';
import useMatterportViewer from '../../../../hooks/useMatterportViewer';
import { createNodeWithTransform, findComponentByType } from '../../../../utils/nodeUtils';
import { FLOATING_TOOLBAR_VERTICAL_ORIENTATION_BUFFER } from '../FloatingToolbar';
import { TOOLBAR_ITEM_CONTAINER_HEIGHT } from '../../common/styledComponents';
import { isDynamicScene } from '../../../../utils/entityModelUtils/sceneUtils';
import { evaluateModelType } from '../../../../utils/sceneAssetUtils';

// Note: ObjectType String is used to record metric. DO NOT change existing ids unless it's necessary.
enum ObjectTypes {
  Object = 'add-object',
  Tag = 'add-object-tag',
  Empty = 'add-object-empty',
  Model = 'add-object-model',
  ModelShader = 'add-effect-model-shader',
  MotionIndicator = 'add-object-motion-indicator',
  Light = 'add-object-light',
  ViewCamera = 'add-object-view-camera',
  Annotation = 'add-object-annotation',
}

type AddObjectMenuItem = ToolbarItemOptions & {
  uuid: ObjectTypes;
};

const labelStrings: { [key in ObjectTypes]: MessageDescriptor } = defineMessages({
  [ObjectTypes.Object]: { defaultMessage: 'Add object', description: 'Menu Item label' },
  [ObjectTypes.Tag]: { defaultMessage: 'Tag', description: 'Menu Item label' },
  [ObjectTypes.Empty]: { defaultMessage: 'Empty node', description: 'Menu Item label' },
  [ObjectTypes.Model]: { defaultMessage: '3D model', description: 'Menu Item label' },
  [ObjectTypes.Light]: { defaultMessage: 'Light', description: 'Menu Item label' },
  [ObjectTypes.ModelShader]: { defaultMessage: 'Model shader', description: 'Menu Item label' },
  [ObjectTypes.MotionIndicator]: { defaultMessage: 'Motion indicator', description: 'Menu Item label' },
  [ObjectTypes.ViewCamera]: { defaultMessage: 'Camera', description: 'Menu Item label' },
  [ObjectTypes.Annotation]: { defaultMessage: 'Annotation', description: 'Menu Item label' },
});

const textStrings = defineMessages({
  [ObjectTypes.Tag]: { defaultMessage: 'Add tag', description: 'Menu Item' },
  [ObjectTypes.Empty]: { defaultMessage: 'Add empty node', description: 'Menu Item' },
  [ObjectTypes.Model]: { defaultMessage: 'Add 3D model', description: 'Menu Item' },
  [ObjectTypes.Light]: { defaultMessage: 'Add light', description: 'Menu Item' },
  [ObjectTypes.ModelShader]: { defaultMessage: 'Add model shader', description: 'Menu Item' },
  [ObjectTypes.MotionIndicator]: { defaultMessage: 'Add motion indicator', description: 'Menu Item' },
  [ObjectTypes.ViewCamera]: { defaultMessage: 'Add camera from current view', description: 'Menu Item' },
  [ObjectTypes.Annotation]: { defaultMessage: 'Add annotation', description: 'Menu Item' },
});

interface AddObjectMenuProps {
  canvasHeight: number | undefined;
  toolbarOrientation: ToolbarOrientation;
}

export const AddObjectMenu = ({ canvasHeight, toolbarOrientation }: AddObjectMenuProps): JSX.Element => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const addComponentInternal = accessStore(sceneComposerId)((state) => state.addComponentInternal);
  const appendSceneNode = accessStore(sceneComposerId)((state) => state.appendSceneNode);
  const selectedSceneNodeRef = accessStore(sceneComposerId)((state) => state.selectedSceneNodeRef);
  const showAssetBrowserCallback = accessStore(sceneComposerId)(
    (state) => state.getEditorConfig().showAssetBrowserCallback,
  );
  const getSceneNodeByRef = accessStore(sceneComposerId)((state) => state.getSceneNodeByRef);
  const document = accessStore(sceneComposerId)((state) => state.document);
  const nodeMap = accessStore(sceneComposerId)((state) => state.document.nodeMap);
  const addMessages = accessStore(sceneComposerId)((state) => state.addMessages);
  const { setAddingWidget, getObject3DBySceneNodeRef } = useEditorState(sceneComposerId);
  const { enableMatterportViewer } = useMatterportViewer();
  const { formatMessage } = useIntl();
  const { activeCameraSettings, mainCameraObject } = useActiveCamera();
  const dynamicSceneEnabled = getGlobalSettings().featureConfig[COMPOSER_FEATURES.DynamicScene];

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
          uuid: ObjectTypes.Light,
        },
        {
          uuid: ObjectTypes.ViewCamera,
          isDisabled: enableMatterportViewer,
        },
        {
          uuid: ObjectTypes.Tag,
        },
        {
          uuid: ObjectTypes.Annotation,
        },
        {
          uuid: ObjectTypes.ModelShader,
          isDisabled: !selectedSceneNodeRef,
        },
        {
          uuid: ObjectTypes.MotionIndicator,
        },
      ].map(mapToMenuItem),
    [showAssetBrowserCallback, selectedSceneNodeRef, enableMatterportViewer],
  );

  const handleAddAnchor = useCallback(() => {
    const type = SceneResourceType.Icon;
    const anchorComponent: IAnchorComponent = {
      icon: getSceneResourceDefaultValue(type),
      type: 'Tag',
    };

    const node = {
      name: 'Tag',
      components: [anchorComponent],
      parentRef: selectedSceneNodeRef,
    } as ISceneNodeInternal;

    setAddingWidget({ type: KnownComponentType.Tag, node });
  }, [selectedSceneNodeRef, appendSceneNode, setAddingWidget]);

  const handleAddColorOverlay = () => {
    // Requires a selected scene node
    if (!selectedSceneNodeRef) return;

    const colorOverlayComponent: IColorOverlayComponentInternal = {
      ref: THREE.MathUtils.generateUUID(),
      type: 'ModelShader',
    };

    addComponentInternal(selectedSceneNodeRef, colorOverlayComponent);
  };

  const handleAddEmpty = useCallback(() => {
    const node: ISceneNode = {
      name: 'Node',
      parentRef: selectedSceneNodeRef,
    };

    appendSceneNode(node);
  }, [selectedSceneNodeRef]);

  const handleAddLight = useCallback(() => {
    const lightComponent: ILightComponent = {
      type: 'Light',
      lightType: LightType.Directional,
      lightSettings: DEFAULT_LIGHT_SETTINGS_MAP[LightType.Directional],
    };

    appendSceneNode({
      name: 'Light',
      components: [lightComponent],
      parentRef: selectedSceneNodeRef,
    });
  }, [selectedSceneNodeRef]);

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
        parentRef: dynamicSceneEnabled && isDynamicScene(document) ? undefined : selectedSceneNodeRef,
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

  const handleAddModel = (mustBeRoot = false) => {
    if (showAssetBrowserCallback) {
      showAssetBrowserCallback((s3BucketArn, contentLocation) => {
        // Check that the file is a valid 3D model type
        const result = evaluateModelType(contentLocation, addMessages, formatMessage);

        // If the file is not valid to load into the scene then ignore it
        if (!result) {
          return;
        }

        let modelUri: string;
        if (s3BucketArn === null) {
          // This should be used for local testing only
          modelUri = contentLocation;
        } else {
          modelUri = `s3://${parseS3BucketFromArn(s3BucketArn)}/${contentLocation}`;
        }

        const gltfComponent: IModelRefComponent = {
          type: KnownComponentType.ModelRef,
          uri: modelUri,
          modelType: result.modelType,
        };

        const node = {
          name: result.modelName,
          components: [gltfComponent],
          parentRef: mustBeRoot ? undefined : selectedSceneNodeRef,
        } as unknown as ISceneNodeInternal;

        setAddingWidget({ type: KnownComponentType.ModelRef, node });
      }, ModelFileTypeList);
    }
  };

  const handleAddMotionIndicator = useCallback(() => {
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
      parentRef: selectedSceneNodeRef,
    } as unknown as ISceneNodeInternal;

    setAddingWidget({ type: KnownComponentType.MotionIndicator, node });
  }, [selectedSceneNodeRef]);

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
        parentRef: selectedSceneNodeRef,
      } as unknown as ISceneNodeInternal;

      setAddingWidget({ type: KnownComponentType.DataOverlay, node });
    },
    [selectedSceneNodeRef, setAddingWidget, appendSceneNode],
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
          case ObjectTypes.MotionIndicator:
            handleAddMotionIndicator();
            break;
          case ObjectTypes.ViewCamera:
            handleAddViewCamera();
            break;
          case ObjectTypes.Annotation:
            handleAddOverlay(Component.DataOverlaySubType.TextAnnotation);
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
