import { ComponentRequest, ComponentUpdateRequest } from '@aws-sdk/client-iottwinmaker';
import { isEmpty } from 'lodash';

import { IDataOverlayComponent, KnownComponentType } from '../../interfaces';
import { componentTypeToId } from '../../common/entityModelConstants';

import { createDataBindingMap } from './dataBindingUtils';

export const createOverlayEntityComponent = (overlay: IDataOverlayComponent): ComponentRequest => {
  const comp: ComponentRequest = {
    componentTypeId: componentTypeToId[KnownComponentType.DataOverlay],
    properties: {
      subType: {
        value: {
          stringValue: overlay.subType,
        },
      },
      dataRows: {
        value: {
          listValue: overlay.dataRows.map((r) => {
            return {
              mapValue: {
                rowType: {
                  stringValue: r.rowType,
                },
                content: {
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
    comp.properties!['rowBindings'] = {
      value: {
        listValue: overlay.valueDataBindings.map((v) => {
          const bindings = createDataBindingMap(v.valueDataBinding);
          bindings['bindingName'] = {
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

export const updateOverlayEntityComponent = (overlay: IDataOverlayComponent): ComponentUpdateRequest => {
  const request = createOverlayEntityComponent(overlay);
  return {
    componentTypeId: request.componentTypeId,
    propertyUpdates: request.properties,
  };
};
