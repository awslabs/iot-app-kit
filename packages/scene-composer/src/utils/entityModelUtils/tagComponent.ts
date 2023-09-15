import { ComponentRequest, ComponentUpdateRequest, ComponentUpdateType } from '@aws-sdk/client-iottwinmaker';
import { DocumentType } from '@aws-sdk/types';

import { IAnchorComponent, KnownComponentType } from '../../interfaces';
import { componentTypeToId } from '../../common/entityModelConstants';
import { IAnchorComponentInternal } from '../../store';
import { generateUUID } from '../mathUtils';

import { createDataBindingMap, parseDataBinding } from './dataBindingUtils';

enum TagComponentProperty {
  Icon = 'icon',
  NavLinkDestination = 'navLink_destination',
  NavLinkParams = 'navLink_params',
  Offset = 'offset',
  ChosenColor = 'chosenColor',
  RuleBasedMapId = 'ruleBasedMapId',
  StyleBinding = 'styleBinding',
}

export const createTagEntityComponent = (tag: IAnchorComponent): ComponentRequest => {
  const comp: ComponentRequest = {
    componentTypeId: componentTypeToId[KnownComponentType.Tag],
    properties: {},
  };
  if (tag.icon) {
    comp.properties![TagComponentProperty.Icon] = {
      value: {
        stringValue: tag.icon,
      },
    };
  }
  if (tag.navLink?.destination) {
    comp.properties![TagComponentProperty.NavLinkDestination] = {
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
    comp.properties![TagComponentProperty.NavLinkParams] = {
      value: {
        mapValue: params,
      },
    };
  }
  if (tag.offset) {
    comp.properties![TagComponentProperty.Offset] = {
      value: {
        listValue: tag.offset.map((v) => ({ doubleValue: v })),
      },
    };
  }
  if (tag.chosenColor) {
    comp.properties![TagComponentProperty.ChosenColor] = {
      value: {
        stringValue: tag.chosenColor,
      },
    };
  }
  if (tag.ruleBasedMapId || tag.valueDataBinding?.dataBindingContext) {
    const map = createDataBindingMap(tag.valueDataBinding);
    map[TagComponentProperty.RuleBasedMapId] = { stringValue: tag.ruleBasedMapId };

    comp.properties![TagComponentProperty.StyleBinding] = {
      value: {
        mapValue: map,
      },
    };
  }

  return comp;
};

export const updateTagEntityComponent = (tag: IAnchorComponent, updateType?: ComponentUpdateType): ComponentUpdateRequest => {
  if (updateType === ComponentUpdateType.DELETE) {
    return {
      componentTypeId: componentTypeToId[KnownComponentType.Tag],
      updateType: updateType,
    };
  }
  
  const request = createTagEntityComponent(tag);
  return {
    componentTypeId: request.componentTypeId,
    propertyUpdates: request.properties,
  };
};

export const parseTagComp = (comp: DocumentType): IAnchorComponentInternal | undefined => {
  if (!comp?.['properties']) {
    return undefined;
  }

  const binding = comp['properties'].find(
    (p) => p['propertyName'] === TagComponentProperty.StyleBinding,
  )?.propertyValue;
  const tagComp: IAnchorComponentInternal = {
    ref: generateUUID(),
    type: KnownComponentType.Tag,
    icon: comp['properties'].find((p) => p['propertyName'] === TagComponentProperty.Icon)?.propertyValue,
    offset: comp['properties'].find((p) => p['propertyName'] === TagComponentProperty.Offset)?.propertyValue,
    navLink: {
      destination: comp['properties'].find((p) => p['propertyName'] === TagComponentProperty.NavLinkDestination)
        ?.propertyValue,
      params: comp['properties'].find((p) => p['propertyName'] === TagComponentProperty.NavLinkParams)?.propertyValue,
    },
    chosenColor: comp['properties'].find((p) => p['propertyName'] === TagComponentProperty.ChosenColor)?.propertyValue,
    ruleBasedMapId: !binding ? undefined : binding[TagComponentProperty.RuleBasedMapId],
    valueDataBinding: parseDataBinding(binding),
  };
  return tagComp;
};
