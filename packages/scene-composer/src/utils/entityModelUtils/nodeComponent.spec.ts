import {
  DEFAULT_ENTITY_BINDING_RELATIONSHIP_NAME,
  DEFAULT_LAYER_COMPONENT_NAME,
  DEFAULT_LAYER_RELATIONSHIP_NAME,
  NODE_COMPONENT_TYPE_ID,
  componentTypeToId,
} from '../../common/entityModelConstants';
import { ISceneComponent, ISceneNode, KnownComponentType } from '../../interfaces';

import { createNodeEntityComponent, parseNode, updateNodeEntityComponent } from './nodeComponent';

describe('createNodeEntityComponent', () => {
  it('should return expected empty node component', () => {
    expect(createNodeEntityComponent({ name: 'Test' })).toEqual({
      componentTypeId: NODE_COMPONENT_TYPE_ID,
      properties: {
        name: {
          value: {
            stringValue: 'Test',
          },
        },
      },
    });
  });

  it('should return expected node component with transform', () => {
    const result = createNodeEntityComponent({
      transform: { position: [1, 2, 3], rotation: [4, 5, 6], scale: [7, 8, 9] },
    });

    expect(result.properties).toEqual({
      name: {
        value: {
          stringValue: 'Node',
        },
      },
      transform_position: {
        value: {
          listValue: [{ doubleValue: 1 }, { doubleValue: 2 }, { doubleValue: 3 }],
        },
      },
      transform_rotation: {
        value: {
          listValue: [{ doubleValue: 4 }, { doubleValue: 5 }, { doubleValue: 6 }],
        },
      },
      transform_scale: {
        value: {
          listValue: [{ doubleValue: 7 }, { doubleValue: 8 }, { doubleValue: 9 }],
        },
      },
    });
  });

  it('should return expected node component with transform constraint.snapToFloor', () => {
    const result = createNodeEntityComponent({ transformConstraint: { snapToFloor: true } });

    expect(result.properties).toEqual({
      name: {
        value: {
          stringValue: 'Node',
        },
      },
      transformConstraint_snapToFloor: {
        value: {
          booleanValue: true,
        },
      },
    });
  });

  it('should return expected node component with layer', () => {
    const result = createNodeEntityComponent({}, 'layer-1');

    expect(result.properties).toEqual({
      name: {
        value: {
          stringValue: 'Node',
        },
      },
      [DEFAULT_LAYER_RELATIONSHIP_NAME]: {
        value: {
          relationshipValue: {
            targetEntityId: 'layer-1',
            targetComponentName: DEFAULT_LAYER_COMPONENT_NAME,
          },
        },
      },
    });
  });

  it('should return expected node component with properties', () => {
    const result = createNodeEntityComponent({
      properties: { matterportId: 'abc def', layerIds: ['layer-1'] },
    } as ISceneNode);

    expect(result.properties).toEqual({
      name: {
        value: {
          stringValue: 'Node',
        },
      },
      properties: {
        value: {
          mapValue: {
            matterportId: {
              stringValue: 'abc%20def',
            },
          },
        },
      },
    });
  });
});

describe('updateNodeEntityComponent', () => {
  it('should return expected empty node component', () => {
    expect(updateNodeEntityComponent({ name: 'Test' })).toEqual({
      componentTypeId: NODE_COMPONENT_TYPE_ID,
      propertyUpdates: {
        name: {
          value: {
            stringValue: 'Test',
          },
        },
      },
    });
  });

  it('should return expected node component with entity binding', () => {
    const result = updateNodeEntityComponent({
      name: 'Test',
      components: [
        {
          type: KnownComponentType.EntityBinding,
          valueDataBinding: {
            dataBindingContext: { entityId: 'data-entity-id' },
          },
        } as ISceneComponent,
      ],
    });

    expect(result).toEqual({
      componentTypeId: NODE_COMPONENT_TYPE_ID,
      propertyUpdates: {
        name: {
          value: {
            stringValue: 'Test',
          },
        },
        [DEFAULT_ENTITY_BINDING_RELATIONSHIP_NAME]: {
          value: {
            relationshipValue: {
              targetEntityId: 'data-entity-id',
            },
          },
        },
      },
    });
  });
});

describe('parseNode', () => {
  const entity = {
    entityId: 'entity-id',
  };
  const tagComp = {
    componentTypeId: componentTypeToId.Tag,
    properties: [],
  };
  const nodeComp = {
    componentTypeId: NODE_COMPONENT_TYPE_ID,
    properties: [
      {
        propertyName: 'name',
        propertyValue: 'Node name',
      },
      {
        propertyName: 'transform_position',
        propertyValue: [3, 3, 3],
      },
      {
        propertyName: 'transform_rotation',
        propertyValue: [2, 2, 2],
      },
      {
        propertyName: 'transfransform_scale',
        propertyValue: [1, 1, 1],
      },
      {
        propertyName: 'transformConstraint_snapToFloor',
        propertyValue: true,
      },
      {
        propertyName: 'properties',
        propertyValue: {
          matterportId: 'abc%20def',
        },
      },
    ],
  };

  it('should return undefined when node entity is empty', () => {
    expect(parseNode(null, null)).toBeUndefined();
    expect(parseNode({}, {})).toBeUndefined();
    expect(parseNode({}, {})).toBeUndefined();
  });

  it('should parse to expected node without components', () => {
    const result = parseNode(entity, nodeComp);

    expect(result).toEqual({
      ref: entity.entityId,
      name: 'Node name',
      childRefs: [],
      transform: {
        position: [3, 3, 3],
        rotation: [2, 2, 2],
        scale: [1, 1, 1],
      },
      components: [],
      transformConstraint: {
        snapToFloor: true,
      },
      properties: {
        matterportId: 'abc def',
      },
    });
  });

  it('should parse to expected node component with components', () => {
    const result = parseNode({ ...entity, components: [tagComp] }, nodeComp);

    expect(result?.components).toEqual([
      expect.objectContaining({
        type: KnownComponentType.Tag,
      }),
    ]);
  });
});
