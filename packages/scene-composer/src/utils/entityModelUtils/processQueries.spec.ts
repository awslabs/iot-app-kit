import { TwinMakerSceneMetadataModule } from '@iot-app-kit/source-iottwinmaker';

import { setTwinMakerSceneMetadataModule } from '../../common/GlobalSettings';
import {
  DEFAULT_ENTITY_BINDING_RELATIONSHIP_NAME,
  DEFAULT_PARENT_RELATIONSHIP_NAME,
  NODE_COMPONENT_TYPE_ID,
  SUB_MODEL_REF_PARENT_RELATIONSHIP_NAME,
  componentTypeToId,
} from '../../common/entityModelConstants';
import { ISubModelRefComponent, KnownComponentType } from '../../interfaces';

import { isValidSceneNodeEntity, processQueries } from './processQueries';

jest.mock('../mathUtils', () => ({
  generateUUID: jest.fn(() => 'random-uuid'),
}));

describe('isValidSceneNodeEntity', () => {
  it('should return false', () => {
    expect(isValidSceneNodeEntity(null)).toEqual(false);
    expect(isValidSceneNodeEntity({ random: 1 })).toEqual(false);
    expect(isValidSceneNodeEntity({ entityId: 'id' })).toEqual(false);
    expect(isValidSceneNodeEntity({ entityId: 'id', components: [] })).toEqual(false);
  });

  it('should return true', () => {
    expect(isValidSceneNodeEntity({ entityId: 'id', components: [{}] })).toEqual(true);
  });
});

describe('processQueries', () => {
  const executeQuery = jest.fn();
  const mockMetadataModule: Partial<TwinMakerSceneMetadataModule> = {
    kgModule: { executeQuery },
  };

  const mockRows = [
    {
      rowData: [
        {
          entityId: 'id1',
          components: [
            {
              componentTypeId: NODE_COMPONENT_TYPE_ID,
              properties: [{ propertyName: 'name', propertyValue: 'name1' }],
            },
          ],
        },
      ],
    },
    {
      rowData: [
        {
          entityId: 'id2',
          components: [
            {
              componentTypeId: NODE_COMPONENT_TYPE_ID,
              properties: [{ propertyName: 'name', propertyValue: 'name2' }],
            },
          ],
        },
        {
          sourceEntityId: 'id2',
          relationshipName: DEFAULT_PARENT_RELATIONSHIP_NAME,
          targetEntityId: 'id1',
        },
      ],
    },
    {
      rowData: [
        {
          entityId: 'id3',
          components: [
            {
              componentTypeId: NODE_COMPONENT_TYPE_ID,
              properties: [{ propertyName: 'name', propertyValue: 'name3' }],
            },
          ],
        },
        {
          sourceEntityId: 'id3',
          relationshipName: DEFAULT_ENTITY_BINDING_RELATIONSHIP_NAME,
          targetEntityId: 'binding-id',
        },
      ],
    },
    {
      rowData: [
        {
          entityId: 'id4',
          components: [
            {
              componentTypeId: NODE_COMPONENT_TYPE_ID,
              properties: [{ propertyName: 'name', propertyValue: 'name4' }],
            },
          ],
        },
        {
          sourceEntityId: 'id4',
          relationshipName: DEFAULT_PARENT_RELATIONSHIP_NAME,
          targetEntityId: 'random',
        },
      ],
    },
    {
      rowData: [
        {
          entityId: 'random',
          components: [],
        },
      ],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    setTwinMakerSceneMetadataModule(mockMetadataModule as unknown as TwinMakerSceneMetadataModule);
    executeQuery.mockResolvedValue({ rows: mockRows });
    (console.error as jest.Mock) = jest.fn();
  });

  it('should return empty when scene metadata module is not set', async () => {
    setTwinMakerSceneMetadataModule(undefined as unknown as TwinMakerSceneMetadataModule);

    const result = await processQueries([]);

    expect(result).toEqual([]);
  });

  it('should call executeQuery with expected query', async () => {
    await processQueries(['random query 1', 'random query 2']);

    expect(executeQuery).toBeCalledTimes(2);
    expect(executeQuery).toBeCalledWith({ queryStatement: 'random query 1' });
    expect(executeQuery).toBeCalledWith({ queryStatement: 'random query 2' });
  });

  it('should return expected sub model ref node', async () => {
    const parentRef = 'model-parent';

    const rows = [
      {
        rowData: [
          {
            entityId: 'id1',
            components: [
              {
                componentTypeId: NODE_COMPONENT_TYPE_ID,
                properties: [
                  { propertyName: 'name', propertyValue: 'name1' },
                  { propertyName: 'transform_position', propertyValue: [3, 3, 3] },
                ],
              },
              {
                componentTypeId: componentTypeToId.SubModelRef,
                properties: [{ propertyName: 'selector', propertyValue: 'selector1' }],
              },
            ],
          },
          {
            relationshipName: SUB_MODEL_REF_PARENT_RELATIONSHIP_NAME,
            sourceEntityId: 'id1',
            targetEntityId: parentRef,
          },
        ],
      },
      {
        rowData: [
          {
            entityId: parentRef,
            components: [
              {
                componentTypeId: NODE_COMPONENT_TYPE_ID,
                properties: [{ propertyName: 'name', propertyValue: 'name1' }],
              },
            ],
          },
        ],
      },
    ];
    executeQuery.mockResolvedValue({ rows: rows });

    const nodes = await processQueries(['random query']);

    expect(nodes.length).toEqual(2);
    expect(nodes[0].parentRef).toEqual(parentRef);
    expect((nodes[0].components[0] as ISubModelRefComponent).parentRef).toEqual(parentRef);
    expect(nodes[0].transform.position).toEqual([3, 3, 3]);
  });

  it('should return expected nodes', async () => {
    const nodes = await processQueries(['random query']);

    expect(console.error).toBeCalledTimes(1);
    expect(nodes).toEqual([
      expect.objectContaining({
        ref: 'id1',
        name: 'name1',
        childRefs: [],
        components: [],
      }),
      expect.objectContaining({
        ref: 'id2',
        name: 'name2',
        childRefs: [],
        parentRef: 'id1',
        components: [],
      }),
      expect.objectContaining({
        ref: 'id3',
        name: 'name3',
        childRefs: [],
        components: [
          {
            ref: 'random-uuid',
            type: KnownComponentType.EntityBinding,
            valueDataBinding: {
              dataBindingContext: {
                entityId: 'binding-id',
              },
            },
          },
        ],
      }),
      expect.objectContaining({
        ref: 'id4',
        name: 'name4',
        childRefs: [],
        parentRef: undefined,
        components: [],
      }),
    ]);
  });
});
