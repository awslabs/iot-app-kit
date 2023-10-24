import { componentTypeToId } from '../../common/entityModelConstants';
import { KnownComponentType } from '../../interfaces';

import { createModelRefEntityComponent, parseModelRefComp, updateModelRefEntityComponent } from './modelRefComponent';

describe('createModelRefEntityComponent', () => {
  it('should return expected modelRef component with uri and modelType', () => {
    const result = createModelRefEntityComponent({
      type: KnownComponentType.ModelRef,
      uri: 'abc',
      modelType: 'modelType',
    });

    expect(result.properties).toEqual({
      uri: {
        value: { stringValue: 'abc' },
      },
      modelType: {
        value: { stringValue: 'modelType' },
      },
    });
  });

  it('should return expected modelRef component by setting castShadow and receiveShadow to false', () => {
    const result = createModelRefEntityComponent({
      type: KnownComponentType.ModelRef,
      uri: 'abc',
      modelType: 'modelType',
      unitOfMeasure: 'decimeters',
      localScale: [1, 1, 1],
      castShadow: false,
      receiveShadow: false,
    });

    expect(result.properties).toEqual({
      uri: {
        value: { stringValue: 'abc' },
      },
      modelType: {
        value: { stringValue: 'modelType' },
      },
      unitOfMeasure: {
        value: {
          stringValue: 'decimeters',
        },
      },
      localScale: {
        value: {
          listValue: [{ doubleValue: 1 }, { doubleValue: 1 }, { doubleValue: 1 }],
        },
      },
      castShadow: {
        value: {
          booleanValue: false,
        },
      },
      receiveShadow: {
        value: {
          booleanValue: false,
        },
      },
    });
  });

  it('should return expected modelRef component by setting castShadow and receiveShadow to true ', () => {
    const result = createModelRefEntityComponent({
      type: KnownComponentType.ModelRef,
      uri: 'abc',
      modelType: 'modelType',
      unitOfMeasure: 'decimeters',
      localScale: [1, 1, 1],
      castShadow: true,
      receiveShadow: true,
    });

    expect(result.properties).toEqual({
      uri: {
        value: { stringValue: 'abc' },
      },
      modelType: {
        value: { stringValue: 'modelType' },
      },
      unitOfMeasure: {
        value: {
          stringValue: 'decimeters',
        },
      },
      localScale: {
        value: {
          listValue: [{ doubleValue: 1 }, { doubleValue: 1 }, { doubleValue: 1 }],
        },
      },
      castShadow: {
        value: {
          booleanValue: true,
        },
      },
      receiveShadow: {
        value: {
          booleanValue: true,
        },
      },
    });
  });
});

describe('updateModelRefEntityComponent', () => {
  it('should update a model ref component', () => {
    expect(
      updateModelRefEntityComponent({ type: KnownComponentType.ModelRef, uri: 'abc', modelType: 'modelType' }),
    ).toEqual({
      componentTypeId: componentTypeToId[KnownComponentType.ModelRef],
      propertyUpdates: {
        uri: {
          value: { stringValue: 'abc' },
        },
        modelType: {
          value: {
            stringValue: 'modelType',
          },
        },
      },
    });
  });
});

describe('parseModelRefComponent', () => {
  it('should parse to expected model ref component', () => {
    expect(
      parseModelRefComp({
        componentTypeId: componentTypeToId[KnownComponentType.ModelRef],
        properties: [
          {
            propertyName: 'uri',
            propertyValue: 'abc',
          },
          {
            propertyName: 'modelType',
            propertyValue: 'modelType',
          },
        ],
      }),
    ).toEqual({
      ref: expect.any(String),
      type: KnownComponentType.ModelRef,
      uri: 'abc',
      modelType: 'modelType',
      castShadow: undefined,
      localScale: undefined,
      receiveShadow: undefined,
      unitOfMeasure: undefined,
    });
  });
});
