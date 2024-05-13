import { ComponentRequest, ComponentUpdateRequest, PropertyUpdateType } from '@aws-sdk/client-iottwinmaker';
import { DocumentType } from '@aws-sdk/types';
import { isEmpty } from 'lodash';

import { IAnchorComponent, KnownComponentType } from '../../interfaces';
import { componentTypeToId } from '../../common/entityModelConstants';
import { IAnchorComponentInternal } from '../../store';
import { generateUUID } from '../mathUtils';

import { createDataBindingMap, parseDataBinding } from './dataBindingUtils';
import { resetProperties } from './updateNodeEntity';

export enum TagComponentProperty {
  Icon = 'icon',
  NavLinkDestination = 'navLink_destination',
  NavLinkParams = 'navLink_params',
  Offset = 'offset',
  ChosenColor = 'chosenColor',
  CustomIconName = 'customIcon_iconName',
  CustomIconPrefix = 'customIcon_prefix',
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
      if (k) {
        params[k] = { stringValue: tag.navLink?.params![k] };
      }
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
  if (tag.customIcon?.iconName) {
    comp.properties![TagComponentProperty.CustomIconName] = {
      value: {
        stringValue: tag.customIcon.iconName,
      },
    };
  }
  if (tag.customIcon?.prefix) {
    comp.properties![TagComponentProperty.CustomIconPrefix] = {
      value: {
        stringValue: tag.customIcon.prefix,
      },
    };
  }
  if (tag.ruleBasedMapId || tag.valueDataBinding?.dataBindingContext) {
    const map = createDataBindingMap(tag.valueDataBinding);
    if (tag.ruleBasedMapId) {
      map[TagComponentProperty.RuleBasedMapId] = { stringValue: tag.ruleBasedMapId };
    }

    comp.properties![TagComponentProperty.StyleBinding] = {
      value: {
        mapValue: map,
      },
    };
  }

  return comp;
};

export const updateTagEntityComponent = (
  tag: IAnchorComponent,
  oldComponent?: IAnchorComponent,
): ComponentUpdateRequest => {
  const request = createTagEntityComponent(tag);
  if (oldComponent) {
    resetProperties(tag, oldComponent, request, Object.values(TagComponentProperty));
    //handle special tags properties that are objects
    if (!tag.navLink?.destination && oldComponent.navLink?.destination) {
      request.properties![TagComponentProperty.NavLinkDestination] = {
        updateType: PropertyUpdateType.RESET_VALUE,
      };
    }
    if ((!tag.navLink?.params || isEmpty(tag.navLink.params)) && oldComponent.navLink?.params) {
      request.properties![TagComponentProperty.NavLinkParams] = {
        updateType: PropertyUpdateType.RESET_VALUE,
      };
    }
    if (!tag.customIcon && oldComponent.customIcon) {
      request.properties![TagComponentProperty.CustomIconPrefix] = {
        updateType: PropertyUpdateType.RESET_VALUE,
      };
      request.properties![TagComponentProperty.CustomIconName] = {
        updateType: PropertyUpdateType.RESET_VALUE,
      };
    }
    if (!tag.valueDataBinding && oldComponent.valueDataBinding) {
      request.properties![TagComponentProperty.StyleBinding] = {
        updateType: PropertyUpdateType.RESET_VALUE,
      };
    }
  }
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

  const customIconName = comp['properties'].find(
    (p) => p['propertyName'] === TagComponentProperty.CustomIconName,
  )?.propertyValue;
  const customIconPrefix = comp['properties'].find(
    (p) => p['propertyName'] === TagComponentProperty.CustomIconPrefix,
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
    customIcon:
      customIconName && customIconPrefix
        ? {
            iconName: customIconName,
            prefix: customIconPrefix,
          }
        : undefined,
    ruleBasedMapId: !binding ? undefined : binding[TagComponentProperty.RuleBasedMapId],
    valueDataBinding: parseDataBinding(binding),
  };
  return tagComp;
};
