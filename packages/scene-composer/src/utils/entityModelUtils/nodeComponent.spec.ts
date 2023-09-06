import {
  DEFAULT_LAYER_COMPONENT_NAME,
  DEFAULT_LAYER_RELATIONSHIP_NAME,
  NODE_COMPONENT_TYPE_ID,
} from '../../common/entityModelConstants';

import { createNodeEntityComponent, updateNodeEntityComponent } from './nodeComponent';

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
    const result = createNodeEntityComponent({ properties: { matterportId: 'abc def' } });

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
});
