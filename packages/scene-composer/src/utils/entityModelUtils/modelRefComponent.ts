import { ComponentRequest, ComponentUpdateRequest } from '@aws-sdk/client-iottwinmaker';
import { DocumentType } from '@aws-sdk/types';

import { IModelRefComponent, KnownComponentType } from '../../interfaces';
import { componentTypeToId } from '../../common/entityModelConstants';
import { IModelRefComponentInternal } from '../../store';
import { generateUUID } from '../mathUtils';

enum ModelRefComponentProperty {
  Uri = 'uri',
  ModelType = 'modelType',
  UnitOfMeasure = 'unitOfMeasure',
  LocalScale = 'localScale',
  CastShadow = 'castShadow',
  ReceiveShadow = 'receiveShadow',
}

export const createModelRefComponent = (model: IModelRefComponent): ComponentRequest => {
  const comp: ComponentRequest = {
    componentTypeId: componentTypeToId[KnownComponentType.ModelRef],
    properties: {
      [ModelRefComponentProperty.Uri]: {
        value: {
          stringValue: model.uri,
        },
      },
      [ModelRefComponentProperty.ModelType]: {
        value: {
          stringValue: model.modelType,
        },
      },
    },
  };

  if (model.unitOfMeasure) {
    comp.properties![ModelRefComponentProperty.UnitOfMeasure] = {
      value: {
        stringValue: model.unitOfMeasure,
      },
    };
  }
  if (model.localScale) {
    comp.properties![ModelRefComponentProperty.LocalScale] = {
      value: {
        listValue: model.localScale.map((l) => ({ doubleValue: l })),
      },
    };
  }
  if (model.castShadow !== undefined) {
    comp.properties![ModelRefComponentProperty.CastShadow] = {
      value: {
        booleanValue: model.castShadow,
      },
    };
  }
  if (model.receiveShadow !== undefined) {
    comp.properties![ModelRefComponentProperty.ReceiveShadow] = {
      value: {
        booleanValue: model.receiveShadow,
      },
    };
  }
  return comp;
};

export const updateModelRefComponent = (model: IModelRefComponent): ComponentUpdateRequest => {
  const request = createModelRefComponent(model);
  return {
    componentTypeId: request.componentTypeId,
    propertyUpdates: request.properties,
  };
};

export const parseModelRefComp = (model: DocumentType): IModelRefComponentInternal | undefined => {
  const findUri = model?.['properties'].find((mp) => mp['propertyName'] === ModelRefComponentProperty.Uri);
  const findModelType = model?.['properties'].find((mp) => mp['propertyName'] === ModelRefComponentProperty.ModelType);
  if (!model?.['properties'] || !findUri || !findModelType) {
    return undefined;
  }

  const modelComponent: IModelRefComponentInternal = {
    ref: generateUUID(),
    type: KnownComponentType.ModelRef,
    uri: findUri?.propertyValue,
    modelType: findModelType?.propertyValue,
    unitOfMeasure: model['properties'].find((mp) => mp['propertyName'] === ModelRefComponentProperty.UnitOfMeasure)
      ?.propertyValue,
    localScale: model['properties'].find((mp) => mp['propertyName'] === ModelRefComponentProperty.LocalScale)
      ?.propertyValue,
    castShadow: model['properties'].find((mp) => mp['propertyName'] === ModelRefComponentProperty.CastShadow)
      ?.propertyValue,
    receiveShadow: model['properties'].find((mp) => mp['propertyName'] === ModelRefComponentProperty.ReceiveShadow)
      ?.propertyValue,
  };
  return modelComponent;
};
