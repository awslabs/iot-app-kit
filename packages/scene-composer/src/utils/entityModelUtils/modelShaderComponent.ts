import { ComponentRequest, ComponentUpdateRequest } from '@aws-sdk/client-iottwinmaker';
import { DocumentType } from '@aws-sdk/types';

import { IColorOverlayComponent, KnownComponentType } from '../../interfaces';
import { componentTypeToId } from '../../common/entityModelConstants';
import { IColorOverlayComponentInternal } from '../../store';
import { generateUUID } from '../mathUtils';

import { createDataBindingMap, parseDataBinding } from './dataBindingUtils';

enum ModelShaderComponentProperty {
  DataBinding = 'dataBinding',
  RuleBasedMapId = 'ruleBasedMapId',
}

export const createModelShaderEntityComponent = (shader: IColorOverlayComponent): ComponentRequest => {
  const comp: ComponentRequest = {
    componentTypeId: componentTypeToId[KnownComponentType.ModelShader],
    properties: {},
  };
  if (shader.ruleBasedMapId || shader.valueDataBinding?.dataBindingContext) {
    const map = createDataBindingMap(shader.valueDataBinding);
    if (shader.ruleBasedMapId) {
      map[ModelShaderComponentProperty.RuleBasedMapId] = { stringValue: shader.ruleBasedMapId };
    }

    comp.properties![ModelShaderComponentProperty.DataBinding] = {
      value: {
        mapValue: map,
      },
    };
  }

  return comp;
};

export const updateModelShaderEntityComponent = (modelShader: IColorOverlayComponent): ComponentUpdateRequest => {
  const request = createModelShaderEntityComponent(modelShader);
  return {
    componentTypeId: request.componentTypeId,
    propertyUpdates: request.properties,
  };
};

export const parseModelShaderComp = (comp: DocumentType): IColorOverlayComponentInternal | undefined => {
  if (!comp?.['properties']) {
    return undefined;
  }

  const binding = comp['properties'].find(
    (p) => p['propertyName'] === ModelShaderComponentProperty.DataBinding,
  )?.propertyValue;
  const modelShaderComp: IColorOverlayComponentInternal = {
    ref: generateUUID(),
    type: KnownComponentType.ModelShader,
    ruleBasedMapId: !binding ? undefined : binding[ModelShaderComponentProperty.RuleBasedMapId],
    valueDataBinding: parseDataBinding(binding),
  };
  return modelShaderComp;
};
