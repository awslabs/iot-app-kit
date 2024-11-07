import { type ComponentRequest, type ComponentUpdateRequest, PropertyUpdateType } from '@aws-sdk/client-iottwinmaker';
import { type DocumentType } from '@aws-sdk/types';

import { type IColorOverlayComponent, KnownComponentType } from '../../interfaces';
import { componentTypeToId } from '../../common/entityModelConstants';
import { type IColorOverlayComponentInternal } from '../../store';
import { generateUUID } from '../mathUtils';

import { createDataBindingMap, parseDataBinding } from './dataBindingUtils';

export enum ModelShaderComponentProperty {
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

export const updateModelShaderEntityComponent = (
  modelShader: IColorOverlayComponent,
  oldComponent?: IColorOverlayComponent,
): ComponentUpdateRequest => {
  const request = createModelShaderEntityComponent(modelShader);
  if (
    !modelShader.ruleBasedMapId &&
    !modelShader.valueDataBinding &&
    (oldComponent?.ruleBasedMapId || oldComponent?.valueDataBinding)
  ) {
    request.properties![ModelShaderComponentProperty.DataBinding] = {
      updateType: PropertyUpdateType.RESET_VALUE,
    };
  }
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
