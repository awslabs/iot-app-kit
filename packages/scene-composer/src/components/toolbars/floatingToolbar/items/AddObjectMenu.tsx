import React, { useContext } from 'react';
import { IntlShape, useIntl } from 'react-intl';
import * as THREE from 'three';

import { DEFAULT_LIGHT_SETTINGS_MAP } from '../../../../common/constants';
import {
  IAnchorComponent,
  ILightComponent,
  IModelRefComponent,
  IMotionIndicatorComponent,
  IViewpointComponent,
  KnownComponentType,
  COMPOSER_FEATURES,
} from '../../../../interfaces';
import { sceneComposerIdContext } from '../../../../common/sceneComposerIdContext';
import { Component, LightType } from '../../../../models/SceneModels';
import { IColorOverlayComponentInternal, ISceneNodeInternal, useEditorState, useStore } from '../../../../store';
import { extractFileNameExtFromUrl, parseS3BucketFromArn } from '../../../../utils/pathUtils';
import { ToolbarItem } from '../../common/ToolbarItem';
import { ToolbarItemOptions } from '../../common/types';
import { getGlobalSettings } from '../../../../common/GlobalSettings';
import { findNearestViableParentAncestorNodeRef } from '../../../../utils/nodeUtils';

type AddObjectMenuItem = ToolbarItemOptions & {
  uuid:
    | 'add-object'
    | 'add-object-tag'
    | 'add-object-empty'
    | 'add-object-model'
    | 'add-object-light'
    | 'add-effect-model-shader'
    | 'add-object-motion-indicator'
    | 'add-object-viewpoint';
};

// Note: uuid is used to record metric. DO NOT change existing ids unless it's necessary.
const defaultAddObjectMenuItems = (intl: IntlShape): AddObjectMenuItem[] => [
  {
    label: intl.formatMessage({ defaultMessage: 'Add object', description: 'Menu Item label' }),
    icon: { name: 'add-plus' },
    uuid: 'add-object',
  },
  {
    label: intl.formatMessage({ defaultMessage: 'Empty node', description: 'Menu Item label' }),
    text: intl.formatMessage({ defaultMessage: 'Add empty node', description: 'Menu Item' }),
    uuid: 'add-object-empty',
  },
  {
    label: intl.formatMessage({ defaultMessage: '3D model', description: 'Menu Item label' }),
    text: intl.formatMessage({ defaultMessage: 'Add 3D model', description: 'Menu Item' }),
    uuid: 'add-object-model',
  },
  {
    label: intl.formatMessage({ defaultMessage: 'Light', description: 'Menu Item label' }),
    text: intl.formatMessage({ defaultMessage: 'Add light', description: 'Menu Item' }),
    uuid: 'add-object-light',
  },
  {
    label: intl.formatMessage({ defaultMessage: 'Tag', description: 'Menu Item label' }),
    text: intl.formatMessage({ defaultMessage: 'Add tag', description: 'Menu Item' }),
    uuid: 'add-object-tag',
  },
  {
    label: intl.formatMessage({ defaultMessage: 'Viewpoint', description: 'Menu Item label' }),
    text: intl.formatMessage({ defaultMessage: 'Add viewpoint', description: 'Menu Item label' }),
    uuid: 'add-object-viewpoint',
    feature: { name: COMPOSER_FEATURES.CUSTOM_VIEWPOINTS },
  },
  {
    label: intl.formatMessage({ defaultMessage: 'Model shader', description: 'Menu Item label' }),
    text: intl.formatMessage({ defaultMessage: 'Add model shader', description: 'Menu Item' }),
    uuid: 'add-effect-model-shader',
  },
];

export function AddObjectMenu() {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const addComponentInternal = useStore(sceneComposerId)((state) => state.addComponentInternal);
  const appendSceneNode = useStore(sceneComposerId)((state) => state.appendSceneNode);
  const selectedSceneNodeRef = useStore(sceneComposerId)((state) => state.selectedSceneNodeRef);
  const showAssetBrowserCallback = useStore(sceneComposerId)(
    (state) => state.getEditorConfig().showAssetBrowserCallback,
  );
  const { setAddingWidget } = useEditorState(sceneComposerId);
  const motionIndicatorEnabled = getGlobalSettings().featureConfig[COMPOSER_FEATURES.MOTION_INDICATOR];
  const enhancedEditingEnabled = getGlobalSettings().featureConfig[COMPOSER_FEATURES.ENHANCED_EDITING];

  const intl = useIntl();

  function getParentRef(): string | undefined {
    return selectedSceneNodeRef;
  }

  function handleAddViewpoint() {
    const viewpointComponent: IViewpointComponent = {
      cameraPosition: [0, 0, 0],
      skyboxImageFormat: 'SixSided',
      skyboxImages: [],
      type: 'Viewpoint',
    };

    const node = {
      name: 'Viewpoint',
      components: [viewpointComponent],
      parentRef: getParentRef(),
    } as unknown as ISceneNodeInternal;

    if (enhancedEditingEnabled) {
      setAddingWidget({ type: KnownComponentType.Viewpoint, node });
    } else {
      appendSceneNode(node);
    }
  }

  function handleAddAnchor() {
    const anchorComponent: IAnchorComponent = {
      type: 'Tag',
    };
    const node = {
      name: 'Tag',
      components: [anchorComponent],
      parentRef: getParentRef(),
    } as unknown as ISceneNodeInternal;

    if (enhancedEditingEnabled) {
      setAddingWidget({ type: KnownComponentType.Tag, node });
    } else {
      appendSceneNode(node);
    }
  }

  function handleAddColorOverlay() {
    // Requires a selected scene node
    if (!selectedSceneNodeRef) return;

    const colorOverlayComponent: IColorOverlayComponentInternal = {
      ref: THREE.MathUtils.generateUUID(),
      type: 'ModelShader',
    };

    addComponentInternal(selectedSceneNodeRef, colorOverlayComponent);
  }

  function handleAddEmpty() {
    const node = {
      name: 'Node',
      parentRef: getParentRef(),
    } as unknown as ISceneNodeInternal;

    appendSceneNode(node);
  }

  function handleAddLight() {
    const lightComponent: ILightComponent = {
      type: 'Light',
      lightType: LightType.Directional,
      lightSettings: DEFAULT_LIGHT_SETTINGS_MAP[LightType.Directional],
    };

    appendSceneNode({
      name: 'Light',
      components: [lightComponent],
      parentRef: getParentRef(),
    });
  }

  function handleAddModel() {
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
          modelType: ext.toUpperCase(),
        };

        const node = {
          name: filename,
          components: [gltfComponent],
          parentRef: getParentRef(),
        } as unknown as ISceneNodeInternal;

        if (enhancedEditingEnabled) {
          setAddingWidget({ type: KnownComponentType.ModelRef, node });
        } else {
          appendSceneNode(node);
        }
      });
    }
  }

  function handleAddMotionIndicator() {
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
      parentRef: getParentRef(),
    } as unknown as ISceneNodeInternal;

    if (enhancedEditingEnabled) {
      setAddingWidget({ type: KnownComponentType.MotionIndicator, node });
    } else {
      appendSceneNode(node);
    }
  }
  const addObjectMenuItems = [...defaultAddObjectMenuItems(intl)];
  if (motionIndicatorEnabled) {
    addObjectMenuItems.push({
      label: intl.formatMessage({ defaultMessage: 'Motion indicator', description: 'Menu Item label' }),
      text: intl.formatMessage({ defaultMessage: 'Add motion indicator', description: 'Menu Item' }),
      uuid: 'add-object-motion-indicator',
    });
  }

  addObjectMenuItems.forEach((item) => {
    if (item.uuid === 'add-object-model') {
      item.isDisabled = showAssetBrowserCallback === undefined;
    }

    if (item.uuid === 'add-effect-model-shader') {
      item.isDisabled = selectedSceneNodeRef === undefined;
    }
  });

  return (
    <ToolbarItem
      items={addObjectMenuItems}
      type='action-select'
      onClick={({ uuid }) => {
        uuid === 'add-object-viewpoint' && handleAddViewpoint();
        uuid === 'add-object-tag' && handleAddAnchor();
        uuid === 'add-effect-model-shader' && handleAddColorOverlay();
        uuid === 'add-object-empty' && handleAddEmpty();
        uuid === 'add-object-light' && handleAddLight();
        uuid === 'add-object-model' && handleAddModel();
        uuid === 'add-object-motion-indicator' && handleAddMotionIndicator();

        getGlobalSettings().metricRecorder?.recordClick(uuid);
      }}
    />
  );
}
