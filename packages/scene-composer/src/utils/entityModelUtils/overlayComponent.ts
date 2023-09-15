import { ComponentRequest, ComponentUpdateRequest, ComponentUpdateType } from '@aws-sdk/client-iottwinmaker';
import { isEmpty } from 'lodash';
import { DocumentType } from '@aws-sdk/types';

import { IDataOverlayComponent, KnownComponentType } from '../../interfaces';
import { DEFAULT_ENTITY_BINDING_RELATIONSHIP_NAME, componentTypeToId } from '../../common/entityModelConstants';
import { Component } from '../../models/SceneModels';
import { IDataOverlayComponentInternal } from '../../store';
import { generateUUID } from '../mathUtils';

import { createDataBindingMap, parseDataBinding } from './dataBindingUtils';

enum OverlayComponentProperty {
  SubType = 'subType',
  DataRows = 'dataRows',
  RowType = 'rowType',
  Content = 'content',
  RowBindings = 'rowBindings',
  BindingName = 'bindingName',
}

export const createOverlayEntityComponent = (overlay: IDataOverlayComponent): ComponentRequest => {
  const comp: ComponentRequest = {
    componentTypeId: componentTypeToId[KnownComponentType.DataOverlay],
    properties: {
      [OverlayComponentProperty.SubType]: {
        value: {
          stringValue: overlay.subType,
        },
      },
      [OverlayComponentProperty.DataRows]: {
        value: {
          listValue: overlay.dataRows.map((r) => {
            return {
              mapValue: {
                [OverlayComponentProperty.RowType]: {
                  stringValue: r.rowType,
                },
                [OverlayComponentProperty.Content]: {
                  stringValue: encodeURI(r.content),
                },
              },
            };
          }),
        },
      },
    },
  };
  if (!isEmpty(overlay.valueDataBindings)) {
    comp.properties![OverlayComponentProperty.RowBindings] = {
      value: {
        listValue: overlay.valueDataBindings.map((v) => {
          const bindings = createDataBindingMap(v.valueDataBinding);
          bindings[OverlayComponentProperty.BindingName] = {
            stringValue: v.bindingName,
          };
          return {
            mapValue: bindings,
          };
        }),
      },
    };
  }
  return comp;
};

export const updateOverlayEntityComponent = (overlay: IDataOverlayComponent, updateType?: ComponentUpdateType): ComponentUpdateRequest => {
  if (updateType === ComponentUpdateType.DELETE) {
    return {
      componentTypeId: componentTypeToId[KnownComponentType.DataOverlay],
      updateType: updateType,
    };
  }
  
  const request = createOverlayEntityComponent(overlay);  
  return {
    componentTypeId: request.componentTypeId,
    propertyUpdates: request.properties,
  };
};

export const parseOverlayComp = (comp: DocumentType): IDataOverlayComponentInternal | undefined => {
  if (!comp?.['properties']) {
    return undefined;
  }

  const bindings: Component.ValueDataBindingNamedMap[] = comp['properties']
    .find((p) => p['propertyName'] === OverlayComponentProperty.RowBindings)
    ?.propertyValue?.map((bindingMap) => ({
      bindingName: bindingMap[OverlayComponentProperty.BindingName],
      valueDataBinding: parseDataBinding(bindingMap),
    }));
  const rows: Component.DataOverlayMarkdownRow[] = comp['properties']
    .find((p) => p['propertyName'] === OverlayComponentProperty.DataRows)
    ?.propertyValue?.map((r) => ({
      content: decodeURI(r[OverlayComponentProperty.Content]),
      rowType: r[OverlayComponentProperty.RowType],
    }));

  const overlayComp: IDataOverlayComponentInternal = {
    ref: generateUUID(),
    type: KnownComponentType.DataOverlay,
    subType: comp['properties'].find((p) => p['propertyName'] === OverlayComponentProperty.SubType)?.propertyValue,
    dataRows: rows ?? [],
    valueDataBindings: bindings ?? [],
  };

  return overlayComp;
};
