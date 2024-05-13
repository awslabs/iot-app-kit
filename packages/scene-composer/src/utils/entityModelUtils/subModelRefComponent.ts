import { ComponentRequest, ComponentUpdateRequest } from '@aws-sdk/client-iottwinmaker';
import { DocumentType } from '@aws-sdk/types';

import { ISubModelRefComponent, KnownComponentType } from '../../interfaces';
import { componentTypeToId } from '../../common/entityModelConstants';
import { ISubModelRefComponentInternal } from '../../store';
import { generateUUID } from '../mathUtils';

import { resetProperties } from './updateNodeEntity';

export enum SubModelRefComponentProperty {
  Selector = 'selector',
  ParentRef = 'parentRef',
}

export const createSubModelRefEntityComponent = (subModel: ISubModelRefComponent): ComponentRequest => {
  const comp: ComponentRequest = {
    componentTypeId: componentTypeToId[KnownComponentType.SubModelRef],
    properties: {
      [SubModelRefComponentProperty.Selector]: {
        value: {
          stringValue: subModel.selector,
        },
      },
    },
  };

  if (subModel.parentRef !== undefined) {
    comp.properties![SubModelRefComponentProperty.ParentRef] = {
      value: {
        relationshipValue: {
          targetEntityId: subModel.parentRef,
        },
      },
    };
  }
  return comp;
};

export const updateSubModelRefEntityComponent = (
  model: ISubModelRefComponent,
  oldComponent?: ISubModelRefComponent,
): ComponentUpdateRequest => {
  const request = createSubModelRefEntityComponent(model);
  if (oldComponent) {
    resetProperties(model, oldComponent, request, Object.values(SubModelRefComponentProperty));
  }
  return {
    componentTypeId: request.componentTypeId,
    propertyUpdates: request.properties,
  };
};

export const parseSubModelRefComp = (comp: DocumentType): ISubModelRefComponentInternal | undefined => {
  const selector = comp?.['properties'].find(
    (mp) => mp['propertyName'] === SubModelRefComponentProperty.Selector,
  )?.propertyValue;

  if (!comp?.['properties'] || selector === undefined) {
    return undefined;
  }

  const subModelComponent: ISubModelRefComponentInternal = {
    ref: generateUUID(),
    type: KnownComponentType.SubModelRef,
    selector: selector,
    parentRef: comp['properties'].find((mp) => mp['propertyName'] === SubModelRefComponentProperty.ParentRef)
      ?.propertyValue,
  };
  return subModelComponent;
};
