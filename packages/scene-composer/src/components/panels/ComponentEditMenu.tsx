import React, { useCallback, useContext, useMemo } from 'react';
import { defineMessages, MessageDescriptor, useIntl } from 'react-intl';
import { IconProps } from '@awsui/components-react';

import { ToolbarItemOptionRaw, ToolbarItemOptions } from '../toolbars/common/types';
import { sceneComposerIdContext } from '../../common/sceneComposerIdContext';
import { IDataOverlayComponentInternal, useStore } from '../../store';
import { KnownComponentType } from '../../interfaces';
import { ToolbarItem } from '../toolbars/common/ToolbarItem';
import { getGlobalSettings } from '../../common/GlobalSettings';
import { Component } from '../../models/SceneModels';
import { ISceneComponentInternal } from '../../store/internalInterfaces';
import { generateUUID } from '../../utils/mathUtils';

interface ComponentEditMenuProps {
  nodeRef: string;
  currentComponent: ISceneComponentInternal;
}

// Note: ObjectType String is used to record metric. DO NOT change existing ids unless it's necessary.
enum ObjectTypes {
  EditComponent = 'edit-component',
  AddDataBinding = 'add-data-binding',
  AddEntityBinding = 'add-entity-binding',
  RemoveEntityBinding = 'remove-entity-binding',
  RemoveAllDataBinding = 'remove-all-data-binding',
  RemoveOverlay = 'remove-overlay',
}

type ComponentEditMenuItem = ToolbarItemOptions & {
  uuid: ObjectTypes;
};

const labelStrings: { [key in ObjectTypes]: MessageDescriptor } = defineMessages({
  [ObjectTypes.EditComponent]: { defaultMessage: 'Edit component', description: 'Menu Item label' },
  [ObjectTypes.AddDataBinding]: { defaultMessage: 'Add data binding', description: 'Menu Item label' },
  [ObjectTypes.AddEntityBinding]: { defaultMessage: 'Add entity binding', description: 'Menu Item label' },
  [ObjectTypes.RemoveEntityBinding]: { defaultMessage: 'Remove entity binding', description: 'Menu Item label' },
  [ObjectTypes.RemoveAllDataBinding]: { defaultMessage: 'Remove all data binding', description: 'Menu Item label' },
  [ObjectTypes.RemoveOverlay]: { defaultMessage: 'Remove overlay', description: 'Menu Item label' },
});

const textStrings = defineMessages({
  [ObjectTypes.AddDataBinding]: { defaultMessage: 'Add data binding', description: 'Menu Item' },
  [ObjectTypes.RemoveAllDataBinding]: { defaultMessage: 'Remove all data binding', description: 'Menu Item' },
  [ObjectTypes.RemoveEntityBinding]: { defaultMessage: 'Remove entity binding', description: 'Menu Item' },
  [ObjectTypes.RemoveOverlay]: { defaultMessage: 'Remove overlay', description: 'Menu Item' },
});

export const ComponentEditMenu: React.FC<ComponentEditMenuProps> = ({ nodeRef, currentComponent }) => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const updateComponentInternal = useStore(sceneComposerId)((state) => state.updateComponentInternal);
  const removeComponent = useStore(sceneComposerId)((state) => state.removeComponent);
  const { formatMessage } = useIntl();

  const mapToMenuItem = useCallback(
    (item: ToolbarItemOptionRaw): ComponentEditMenuItem => {
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

  const componentItems = useMemo(() => {
    switch (currentComponent.type) {
      case KnownComponentType.EntityBinding:
        return [
          {
            uuid: ObjectTypes.RemoveEntityBinding,
          },
        ];

      case KnownComponentType.DataOverlay: {
        const items = [
          {
            uuid: ObjectTypes.AddDataBinding,
          },
        ];
        if ((currentComponent as IDataOverlayComponentInternal).subType === Component.DataOverlaySubType.OverlayPanel) {
          items.push({
            uuid: ObjectTypes.RemoveOverlay,
          });
        }
        return items;
      }
      default:
        return [];
    }
  }, [currentComponent]);

  const menuItems = useMemo(
    () =>
      [
        {
          icon: { name: 'ellipsis' as IconProps.Name },
          uuid: ObjectTypes.EditComponent,
        },
        ...componentItems,
      ].map(mapToMenuItem),
    [currentComponent],
  );

  const handleAddDataBinding = useCallback(() => {
    switch (currentComponent.type) {
      case KnownComponentType.EntityBinding: {
        updateComponentInternal(nodeRef, currentComponent);
        return;
      }
      case KnownComponentType.DataOverlay: {
        const newComponentPartial = {
          ...currentComponent,
          valueDataBindings: [
            ...((currentComponent as IDataOverlayComponentInternal).valueDataBindings || []),
            { bindingName: generateUUID() },
          ],
        };
        updateComponentInternal(nodeRef, newComponentPartial);
        return;
      }
      default:
        throw new Error(`Add data binding not implemented for current component type ${currentComponent.type}`);
    }
  }, [nodeRef, currentComponent]);

  const handleRemoveEntityBinding = useCallback(() => {
    if (currentComponent.type == KnownComponentType.EntityBinding) {
      removeComponent(nodeRef, currentComponent.ref);
      return;
    }
    throw new Error(`Remove all data binding not implemented for current component type ${currentComponent.type}`);
  }, [nodeRef, currentComponent]);

  return menuItems.length > 1 ? (
    <div style={{ height: '24px' }}>
      <ToolbarItem
        menuPosition='bottom-right'
        menuHeight='24px'
        items={menuItems}
        type='action-select'
        onClick={({ uuid }) => {
          switch (uuid) {
            case ObjectTypes.AddDataBinding:
              handleAddDataBinding();
              break;
            case ObjectTypes.RemoveEntityBinding:
              handleRemoveEntityBinding();
              break;
            case ObjectTypes.RemoveOverlay:
              removeComponent(nodeRef, currentComponent.ref);
              break;
          }

          getGlobalSettings().metricRecorder?.recordClick(`${currentComponent.type}-${uuid}`);
        }}
      />
    </div>
  ) : (
    <></>
  );
};
