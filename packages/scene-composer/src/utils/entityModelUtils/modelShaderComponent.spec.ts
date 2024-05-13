import { PropertyUpdateType } from '@aws-sdk/client-iottwinmaker';

import { componentTypeToId } from '../../common/entityModelConstants';
import { KnownComponentType } from '../../interfaces';

import {
  createModelShaderEntityComponent,
  parseModelShaderComp,
  updateModelShaderEntityComponent,
  ModelShaderComponentProperty,
} from './modelShaderComponent';

describe('createModelShaderEntityComponent', () => {
  it('should return expected empty model shader component', () => {
    expect(createModelShaderEntityComponent({ type: KnownComponentType.ModelShader })).toEqual({
      componentTypeId: componentTypeToId[KnownComponentType.ModelShader],
      properties: {},
    });
  });

  it('should return expected model shader component with rule id', () => {
    const result = createModelShaderEntityComponent({
      type: KnownComponentType.ModelShader,
      ruleBasedMapId: 'rule-id',
    });

    expect(result.properties).toEqual({
      dataBinding: {
        value: {
          mapValue: {
            ruleBasedMapId: {
              stringValue: 'rule-id',
            },
          },
        },
      },
    });
  });

  it('should return expected model shader component with data binding context', () => {
    const result = createModelShaderEntityComponent({
      type: KnownComponentType.ModelShader,
      valueDataBinding: {
        dataBindingContext: {
          entityId: 'eid',
          componentName: 'cname',
          propertyName: 'pname',
        },
      },
    });

    expect(result.properties).toEqual({
      dataBinding: {
        value: {
          mapValue: {
            entityId: {
              stringValue: 'eid',
            },
            componentName: {
              stringValue: 'cname',
            },
            propertyName: {
              stringValue: 'pname',
            },
          },
        },
      },
    });
  });
});

describe('updateModelShaderEntityComponent', () => {
  it('should return expected empty model shader component', () => {
    expect(updateModelShaderEntityComponent({ type: KnownComponentType.ModelShader })).toEqual({
      componentTypeId: componentTypeToId[KnownComponentType.ModelShader],
      propertyUpdates: {},
    });
  });

  it('should reset properties that are no longer present', () => {
    const shader = { type: KnownComponentType.ModelShader };
    expect(updateModelShaderEntityComponent(shader, { ...shader, ruleBasedMapId: 'rule' })).toEqual({
      componentTypeId: componentTypeToId[KnownComponentType.ModelShader],
      propertyUpdates: {
        [ModelShaderComponentProperty.DataBinding]: {
          updateType: PropertyUpdateType.RESET_VALUE,
        },
      },
    });
    expect(updateModelShaderEntityComponent(shader, { ...shader, valueDataBinding: {} })).toEqual({
      componentTypeId: componentTypeToId[KnownComponentType.ModelShader],
      propertyUpdates: {
        [ModelShaderComponentProperty.DataBinding]: {
          updateType: PropertyUpdateType.RESET_VALUE,
        },
      },
    });
  });
});

describe('parseModelShaderComp', () => {
  it('should parse to expected empty model shader component', () => {
    expect(
      parseModelShaderComp({
        componentTypeId: componentTypeToId[KnownComponentType.ModelShader],
        properties: [],
      }),
    ).toEqual({
      ref: expect.any(String),
      type: KnownComponentType.ModelShader,
      ruleBasedMapId: undefined,
      valueDataBinding: undefined,
    });
  });

  it('should parse to expected model shader component with rule id', () => {
    const result = parseModelShaderComp({
      componentTypeId: componentTypeToId[KnownComponentType.ModelShader],
      properties: [
        {
          propertyName: 'dataBinding',
          propertyValue: {
            ruleBasedMapId: 'rule-id',
          },
        },
      ],
    });

    expect(result?.ruleBasedMapId).toEqual('rule-id');
  });

  it('should parse to expected model shader component with data binding context', () => {
    const result = parseModelShaderComp({
      componentTypeId: componentTypeToId[KnownComponentType.ModelShader],
      properties: [
        {
          propertyName: 'dataBinding',
          propertyValue: {
            entityId: 'eid',
            componentName: 'cname',
            propertyName: 'pname',
            isStaticData: 'true',
          },
        },
      ],
    });

    expect(result?.valueDataBinding).toEqual({
      dataBindingContext: {
        entityId: 'eid',
        componentName: 'cname',
        propertyName: 'pname',
      },
      isStaticData: true,
    });
  });
});
