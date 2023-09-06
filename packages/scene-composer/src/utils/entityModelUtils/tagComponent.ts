import { ComponentRequest, ComponentUpdateRequest } from '@aws-sdk/client-iottwinmaker';

import { IAnchorComponent, KnownComponentType } from '../../interfaces';
import { componentTypeToId } from '../../common/entityModelConstants';

import { createDataBindingMap } from './dataBindingUtils';

export const createTagEntityComponent = (tag: IAnchorComponent): ComponentRequest => {
  const comp: ComponentRequest = {
    componentTypeId: componentTypeToId[KnownComponentType.Tag],
    properties: {},
  };
  if (tag.icon) {
    comp.properties!['icon'] = {
      value: {
        stringValue: tag.icon,
      },
    };
  }
  if (tag.navLink?.destination) {
    comp.properties!['navLink_destination'] = {
      value: {
        stringValue: tag.navLink.destination,
      },
    };
  }
  if (tag.navLink?.params) {
    const params = {};
    Object.keys(tag.navLink.params).forEach((k) => {
      params[k] = { stringValue: encodeURI(tag.navLink?.params![k]) };
    });
    comp.properties!['navLink_params'] = {
      value: {
        mapValue: params,
      },
    };
  }
  if (tag.offset) {
    comp.properties!['offset'] = {
      value: {
        listValue: tag.offset.map((v) => ({ doubleValue: v })),
      },
    };
  }
  if (tag.chosenColor) {
    comp.properties!['chosenColor'] = {
      value: {
        stringValue: tag.chosenColor,
      },
    };
  }
  if (tag.ruleBasedMapId || tag.valueDataBinding?.dataBindingContext) {
    const map = createDataBindingMap(tag.valueDataBinding);
    map['ruleBasedMapId'] = { stringValue: tag.ruleBasedMapId };

    comp.properties!['styleBinding'] = {
      value: {
        mapValue: map,
      },
    };
  }

  return comp;
};

export const updateTagEntityComponent = (tag: IAnchorComponent): ComponentUpdateRequest => {
  const request = createTagEntityComponent(tag);
  return {
    componentTypeId: request.componentTypeId,
    propertyUpdates: request.properties,
  };
};
