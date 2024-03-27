import { IconProps } from '@cloudscape-design/components';
import React, { useCallback, useContext, useMemo } from 'react';
import { MessageDescriptor, defineMessages, useIntl } from 'react-intl';
import * as THREE from 'three';

import { getGlobalSettings } from '../../common/GlobalSettings';
import { sceneComposerIdContext } from '../../common/sceneComposerIdContext';
import { COMPOSER_FEATURES, KnownComponentType } from '../../interfaces';
import { Component } from '../../models/SceneModels';
import { IDataOverlayComponentInternal, IModelRefComponentInternal, useStore, useEditorState } from '../../store';
import { IEntityBindingComponentInternal, IAnimationComponentInternal } from '../../store/internalInterfaces';
import { findComponentByType } from '../../utils/nodeUtils';
import { ToolbarItem } from '../toolbars/common/ToolbarItem';
import { ToolbarItemOptionRaw, ToolbarItemOptions } from '../toolbars/common/types';
import { animationObjectKey } from '../three-fiber/AnimationComponent/AnimationComponent';

interface AddComponentMenuProps {
  onSelect?: (selectedObject: ObjectTypes) => void;
}

// Note: ObjectType String is used to record metric. DO NOT change existing ids unless it's necessary.
enum ObjectTypes {
  Component = 'add-component',
  Overlay = 'add-component-overlay',
  EntityBinding = 'add-component-entity-binding',
  Animations = 'add-component-animations',
}

type AddComponentMenuItem = ToolbarItemOptions & {
  uuid: ObjectTypes;
};

const labelStrings: { [key in ObjectTypes]: MessageDescriptor } = defineMessages({
  [ObjectTypes.Component]: { defaultMessage: 'Add component', description: 'Menu Item label' },
  [ObjectTypes.Overlay]: { defaultMessage: 'Overlay', description: 'Menu Item label' },
  [ObjectTypes.EntityBinding]: { defaultMessage: 'Add entity binding', description: 'Menu Item label' },
  [ObjectTypes.Animations]: { defaultMessage: 'Add Animations', description: 'Menu Item label' },
});

const textStrings = defineMessages({
  [ObjectTypes.Overlay]: { defaultMessage: 'Add overlay', description: 'Menu Item' },
  [ObjectTypes.EntityBinding]: { defaultMessage: 'Add entity binding', description: 'Menu Item' },
  [ObjectTypes.Animations]: { defaultMessage: 'Add Animations', description: 'Menu Item' },
});
export const AddComponentMenu: React.FC<AddComponentMenuProps> = ({ onSelect }) => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const addComponentInternal = useStore(sceneComposerId)((state) => state.addComponentInternal);
  const updateComponentInternal = useStore(sceneComposerId)((state) => state.updateComponentInternal);
  const selectedSceneNodeRef = useStore(sceneComposerId)((state) => state.selectedSceneNodeRef);
  const getSceneNodeByRef = useStore(sceneComposerId)((state) => state.getSceneNodeByRef);
  const { formatMessage } = useIntl();
  const selectedSceneNode = getSceneNodeByRef(selectedSceneNodeRef);
  const AnimationComponentEnabled = getGlobalSettings().featureConfig[COMPOSER_FEATURES.Animations];
  const { getObject3DBySceneNodeRef } = useEditorState(sceneComposerId);

  const object3D = selectedSceneNode ? getObject3DBySceneNodeRef(selectedSceneNode.ref) : undefined;
  const animationObject3D = object3D?.getObjectByName(animationObjectKey);
  const canAnimate = animationObject3D ? animationObject3D?.animations.length > 0 : false;

  const isTagComponent = !!findComponentByType(selectedSceneNode, KnownComponentType.Tag);
  const isOverlayComponent = !!findComponentByType(selectedSceneNode, KnownComponentType.DataOverlay);
  const isEntityBindingComponent = !!findComponentByType(selectedSceneNode, KnownComponentType.EntityBinding);
  const isAnimationComponent = !!findComponentByType(selectedSceneNode, KnownComponentType.Animation);
  const mapToMenuItem = useCallback(
    (item: ToolbarItemOptionRaw): AddComponentMenuItem => {
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

  const addComponentMenuItems = useMemo(() => {
    const addOverlayItem = isTagComponent
      ? [
          {
            uuid: ObjectTypes.Overlay,
            isDisabled: isOverlayComponent,
          },
        ]
      : [];
    const addEntityBindingItem = [
      {
        uuid: ObjectTypes.EntityBinding,
        isDisabled: isEntityBindingComponent,
      },
    ];
    const addAnimationItem =
      AnimationComponentEnabled && canAnimate && !isAnimationComponent
        ? [
            {
              uuid: ObjectTypes.Animations,
              isDisabled: false,
            },
          ]
        : [];
    return [
      {
        icon: { name: 'add-plus' as IconProps.Name },
        uuid: ObjectTypes.Component,
      },
      ...addOverlayItem,
      ...addEntityBindingItem,
      ...addAnimationItem,
    ].map(mapToMenuItem);
  }, [
    selectedSceneNodeRef,
    selectedSceneNode,
    isOverlayComponent,
    isTagComponent,
    isAnimationComponent,
    AnimationComponentEnabled,
    canAnimate,
  ]);

  const handleAddOverlay = useCallback(() => {
    if (!selectedSceneNodeRef) return;

    const component: IDataOverlayComponentInternal = {
      ref: THREE.MathUtils.generateUUID(),
      type: KnownComponentType.DataOverlay,
      subType: Component.DataOverlaySubType.OverlayPanel,
      valueDataBindings: [],
      dataRows: [
        {
          rowType: Component.DataOverlayRowType.Markdown,
          content: '',
        },
      ],
    };

    addComponentInternal(selectedSceneNodeRef, component);
  }, [selectedSceneNodeRef, selectedSceneNode]);

  const handleAddEntityBinding = useCallback(() => {
    if (!selectedSceneNodeRef) return;
    const entityBindingComponent = findComponentByType(selectedSceneNode, KnownComponentType.EntityBinding);

    if (entityBindingComponent) {
      // TODO: Can we remove this? This is not updating anything
      updateComponentInternal(selectedSceneNodeRef, entityBindingComponent);
      return;
    }

    const component: IEntityBindingComponentInternal = {
      ref: THREE.MathUtils.generateUUID(),
      type: KnownComponentType.EntityBinding,
      valueDataBinding: { dataBindingContext: undefined },
    };

    addComponentInternal(selectedSceneNodeRef, component);
  }, [selectedSceneNodeRef, selectedSceneNode]);

  const handleAddAnimations = useCallback(() => {
    if (!selectedSceneNodeRef) return;

    const modelRefComponent = findComponentByType(selectedSceneNode, KnownComponentType.ModelRef);
    if (modelRefComponent) {
      const animationComponent: IAnimationComponentInternal = {
        ref: THREE.MathUtils.generateUUID(),
        currentAnimations: [],
        type: KnownComponentType.Animation,
        uri: (modelRefComponent as IModelRefComponentInternal).uri,
      };
      addComponentInternal(selectedSceneNodeRef, animationComponent);
    }
  }, [selectedSceneNodeRef, selectedSceneNode]);

  return addComponentMenuItems.length > 1 ? (
    <div style={{ width: '40px' }}>
      <ToolbarItem
        menuPosition='bottom-left'
        items={addComponentMenuItems}
        type='action-select'
        onSelect={({ uuid }) => {
          switch (uuid) {
            case ObjectTypes.Animations:
              handleAddAnimations();
              break;
            case ObjectTypes.EntityBinding:
              handleAddEntityBinding();
              break;
            case ObjectTypes.Overlay:
              handleAddOverlay();
              break;
          }
          onSelect?.(uuid);
          getGlobalSettings().metricRecorder?.recordClick(uuid);
        }}
      />
    </div>
  ) : (
    <></>
  );
};
