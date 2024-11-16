import { PropertyUpdateType } from '@aws-sdk/client-iottwinmaker';

import {
  DEFAULT_ENTITY_BINDING_RELATIONSHIP_NAME,
  DEFAULT_LAYER_COMPONENT_NAME,
  DEFAULT_LAYER_RELATIONSHIP_NAME,
  NODE_COMPONENT_TYPE_ID,
  RESERVED_LAYER_ID,
  componentTypeToId,
} from '../../common/entityModelConstants';
import { type ISceneComponent, type ISceneNode, KnownComponentType } from '../../interfaces';

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
            targetEntityId: RESERVED_LAYER_ID,
            targetComponentName: DEFAULT_LAYER_COMPONENT_NAME,
          },
        },
      },
    });
  });

  it('should return expected node component with properties', () => {
    const result = createNodeEntityComponent({
      properties: { matterportId: 'abc def', layerIds: ['layer-1'], alwaysVisible: true },
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
              stringValue: 'abc def',
            },
            alwaysVisible: {
              stringValue: 'true',
            },
          },
        },
      },
    });
  });

  it('should return expected node component without properties when only runtime property exist', () => {
    const result = createNodeEntityComponent({
      properties: { layerIds: ['layer-1'] },
    } as ISceneNode);

    expect(result.properties!.properties).toBeUndefined();
  });

  it('should return expected node component with entity binding', () => {
    const result = createNodeEntityComponent({
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
      properties: {
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

  it('should remove entity binding', () => {
    expect(
      updateNodeEntityComponent(
        { name: 'Test' },
        {
          name: 'Test',
          components: [
            {
              type: KnownComponentType.EntityBinding,
              valueDataBinding: {
                dataBindingContext: { entityId: 'data-entity-id' },
              },
            } as ISceneComponent,
          ],
        },
      ),
    ).toEqual({
      componentTypeId: NODE_COMPONENT_TYPE_ID,
      propertyUpdates: {
        name: {
          value: {
            stringValue: 'Test',
          },
        },
        [DEFAULT_ENTITY_BINDING_RELATIONSHIP_NAME]: {
          updateType: PropertyUpdateType.RESET_VALUE,
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
  const overlayComp = {
    componentTypeId: componentTypeToId.DataOverlay,
    properties: [
      {
        propertyName: 'subType',
        propertyValue: 'TextAnnotation',
      },
    ],
  };
  const modelRefComp = {
    componentTypeId: componentTypeToId.ModelRef,
    properties: [
      {
        propertyName: 'uri',
        propertyValue: 'uri.abc',
      },
      {
        propertyName: 'modelType',
        propertyValue: 'GLB',
      },
    ],
  };
  const cameraComp = {
    componentTypeId: componentTypeToId.Camera,
    properties: [],
  };
  const indicatorComp = {
    componentTypeId: componentTypeToId.MotionIndicator,
    properties: [
      {
        propertyName: 'shape',
        propertyValue: 'LinearPlane',
      },
    ],
  };
  const modelShaderComp = {
    componentTypeId: componentTypeToId.ModelShader,
    properties: [],
  };
  const lightComp = {
    componentTypeId: componentTypeToId.Light,
    properties: [
      {
        propertyName: 'lightType',
        propertyValue: 'Ambient',
      },
      {
        propertyName: 'lightSettings_color',
        propertyValue: '#123456',
      },
      {
        propertyName: 'lightSettings_intensity',
        propertyValue: 2,
      },
    ],
  };
  const subModelRefComp = {
    componentTypeId: componentTypeToId.SubModelRef,
    properties: [
      {
        propertyName: 'selector',
        propertyValue: 'abc',
      },
    ],
  };
  const planeGeometryComp = {
    componentTypeId: componentTypeToId.PlaneGeometry,
    properties: [
      {
        propertyName: 'width',
        propertyValue: 1,
      },
      {
        propertyName: 'height',
        propertyValue: 2,
      },
      {
        propertyName: 'color',
        propertyValue: '#abcdef',
      },
    ],
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
          matterportId: 'abc def',
          alwaysVisible: 'true',
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
        alwaysVisible: true,
      },
    });
  });

  it('should parse to expected node component with components', () => {
    const result = parseNode(
      {
        ...entity,
        components: [
          tagComp,
          overlayComp,
          modelRefComp,
          cameraComp,
          indicatorComp,
          modelShaderComp,
          lightComp,
          subModelRefComp,
          planeGeometryComp,
        ],
      },
      nodeComp,
    );

    const expectedComponents = [
      expect.objectContaining({
        type: KnownComponentType.Tag,
      }),
      expect.objectContaining({
        type: KnownComponentType.DataOverlay,
      }),
      expect.objectContaining({
        type: KnownComponentType.ModelRef,
      }),
      expect.objectContaining({
        type: KnownComponentType.Camera,
      }),
      expect.objectContaining({
        type: KnownComponentType.MotionIndicator,
      }),
      expect.objectContaining({
        type: KnownComponentType.ModelShader,
      }),
      expect.objectContaining({
        type: KnownComponentType.Light,
      }),
      expect.objectContaining({
        type: KnownComponentType.SubModelRef,
      }),
      expect.objectContaining({
        type: KnownComponentType.PlaneGeometry,
      }),
    ];
    expect(result?.components).toEqual(expectedComponents);
  });
});
