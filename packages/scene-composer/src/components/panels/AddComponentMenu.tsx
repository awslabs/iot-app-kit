import React, { useCallback, useContext, useMemo } from 'react';
import { defineMessages, MessageDescriptor, useIntl } from 'react-intl';
import * as THREE from 'three';
import { IconProps } from '@awsui/components-react';

import { ToolbarItemOptionRaw, ToolbarItemOptions } from '../toolbars/common/types';
import { sceneComposerIdContext } from '../../common/sceneComposerIdContext';
import { IDataOverlayComponentInternal, useStore } from '../../store';
import { findComponentByType } from '../../utils/nodeUtils';
import { COMPOSER_FEATURES, KnownComponentType } from '../../interfaces';
import { ToolbarItem } from '../toolbars/common/ToolbarItem';
import { getGlobalSettings } from '../../common/GlobalSettings';
import { Component } from '../../models/SceneModels';
import { IDataBindingComponentInternal } from '../../store/internalInterfaces';

interface AddComponentMenuProps {
  onSelect?: (selectedObject: ObjectTypes) => void;
}

// Note: ObjectType String is used to record metric. DO NOT change existing ids unless it's necessary.
enum ObjectTypes {
  Component = 'add-component',
  Overlay = 'add-component-overlay',
  DataBinding = 'add-component-data-binding',
}

type AddComponentMenuItem = ToolbarItemOptions & {
  uuid: ObjectTypes;
};

const labelStrings: { [key in ObjectTypes]: MessageDescriptor } = defineMessages({
  [ObjectTypes.Component]: { defaultMessage: 'Add component', description: 'Menu Item label' },
  [ObjectTypes.Overlay]: { defaultMessage: 'Overlay', description: 'Menu Item label' },
  [ObjectTypes.DataBinding]: { defaultMessage: 'Add entity binding', description: 'Menu Item label' },
});

const textStrings = defineMessages({
  [ObjectTypes.Overlay]: { defaultMessage: 'Add overlay', description: 'Menu Item' },
  [ObjectTypes.DataBinding]: { defaultMessage: 'Add entity binding', description: 'Menu Item' },
});

export const AddComponentMenu: React.FC<AddComponentMenuProps> = ({ onSelect }) => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const addComponentInternal = useStore(sceneComposerId)((state) => state.addComponentInternal);
  const updateComponentInternal = useStore(sceneComposerId)((state) => state.updateComponentInternal);
  const selectedSceneNodeRef = useStore(sceneComposerId)((state) => state.selectedSceneNodeRef);
  const getSceneNodeByRef = useStore(sceneComposerId)((state) => state.getSceneNodeByRef);
  const { formatMessage } = useIntl();
  const selectedSceneNode = getSceneNodeByRef(selectedSceneNodeRef);
  const dataBindingComponentEnabled = getGlobalSettings().featureConfig[COMPOSER_FEATURES.DataBinding];

  const isTagComponent = !!findComponentByType(selectedSceneNode, KnownComponentType.Tag);
  const isOverlayComponent = !!findComponentByType(selectedSceneNode, KnownComponentType.DataOverlay);
  const isDataBindingComponent = !!findComponentByType(selectedSceneNode, KnownComponentType.DataBinding);
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
            feature: { name: COMPOSER_FEATURES.Overlay },
          },
        ]
      : [];
    const addDataBindingItem =
      dataBindingComponentEnabled && !findComponentByType(selectedSceneNode, KnownComponentType.DataBinding)
        ? [
            {
              uuid: ObjectTypes.DataBinding,
              isDisabled: isDataBindingComponent,
            },
          ]
        : [];

    return [
      {
        icon: { name: 'add-plus' as IconProps.Name },
        uuid: ObjectTypes.Component,
      },
      ...addOverlayItem,
      ...addDataBindingItem,
    ].map(mapToMenuItem);
  }, [selectedSceneNodeRef, selectedSceneNode, isOverlayComponent, isTagComponent, dataBindingComponentEnabled]);

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

  const handleAddDataBinding = useCallback(() => {
    if (!selectedSceneNodeRef) return;

    const dataBindingComponent = findComponentByType(selectedSceneNode, KnownComponentType.DataBinding);

    if (dataBindingComponent) {
      const newComponentPartial = {
        ...dataBindingComponent,
        valueDataBindings: [...(dataBindingComponent as IDataBindingComponentInternal).valueDataBindings, {}],
      };
      updateComponentInternal(selectedSceneNodeRef, newComponentPartial);
      return;
    }

    const component: IDataBindingComponentInternal = {
      ref: THREE.MathUtils.generateUUID(),
      type: KnownComponentType.DataBinding,
      valueDataBindings: [{}],
    };

    addComponentInternal(selectedSceneNodeRef, component);
  }, [selectedSceneNodeRef, selectedSceneNode]);

  return addComponentMenuItems.length > 1 ? (
    <div style={{ width: '40px' }}>
      <ToolbarItem
        menuPosition='bottom-left'
        items={addComponentMenuItems}
        type='action-select'
        onClick={({ uuid }) => {
          switch (uuid) {
            case ObjectTypes.DataBinding:
              handleAddDataBinding();
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
