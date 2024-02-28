import { TwinMakerSceneMetadataModule } from '@iot-app-kit/source-iottwinmaker';
import { Object3D } from 'three';
import flushPromises from 'flush-promises';
import { ResourceNotFoundException } from '@aws-sdk/client-iottwinmaker';

import { setFeatureConfig, setTwinMakerSceneMetadataModule } from '../../common/GlobalSettings';
import {
  LAYER_ROOT_ENTITY_ID,
  LAYER_ROOT_ENTITY_NAME,
  SCENE_ROOT_ENTITY_COMPONENT_NAME,
  SCENE_ROOT_ENTITY_ID,
  SCENE_ROOT_ENTITY_NAME,
} from '../../common/entityModelConstants';
import { ISceneDocumentInternal, ISceneNodeInternal, SceneNodeRuntimeProperty } from '../../store/internalInterfaces';
import { defaultNode } from '../../../__mocks__/sceneNode';
import { findComponentByType, getFinalNodeTransform } from '../nodeUtils';
import { COMPOSER_FEATURES, KnownSceneProperty } from '../../interfaces';

import {
  checkIfEntityExists,
  convertAllNodesToEntities,
  createSceneEntityId,
  createSceneRootEntity,
  isDynamicNode,
  isDynamicScene,
  prepareWorkspace,
  staticNodeCount,
  updateSceneRootEntity,
} from './sceneUtils';
import { createNodeEntity } from './createNodeEntity';
import { createSceneEntityComponent, updateSceneEntityComponent } from './sceneComponent';

jest.mock('../mathUtils', () => ({
  generateUUID: jest.fn(() => 'random-uuid'),
}));

jest.mock('./createNodeEntity', () => ({
  createNodeEntity: jest.fn(),
}));

jest.mock('./sceneComponent', () => ({
  createSceneEntityComponent: jest.fn(),
  updateSceneEntityComponent: jest.fn(),
}));

jest.mock('../nodeUtils', () => ({
  findComponentByType: jest.fn(),
  getFinalNodeTransform: jest.fn(),
}));

describe('createSceneEntityId', () => {
  it('should return expected scene entityId', () => {
    expect(createSceneEntityId('test')).toEqual('SCENE_test_random-uuid');
  });
});

describe('createSceneRootEntity', () => {
  const createSceneEntity = jest.fn();
  const mockMetadataModule: Partial<TwinMakerSceneMetadataModule> = {
    createSceneEntity,
    getSceneId: jest.fn().mockReturnValue('test'),
  };

  it('should call createSceneEntity with expected input when DynamicSceneAlpha is off', () => {
    setTwinMakerSceneMetadataModule(mockMetadataModule as unknown as TwinMakerSceneMetadataModule);
    setFeatureConfig({});

    createSceneRootEntity({
      ruleMap: {},
      version: '1',
    });

    expect(createSceneEntity).toBeCalledWith({
      workspaceId: undefined,
      entityId: createSceneEntityId('test'),
      parentEntityId: SCENE_ROOT_ENTITY_ID,
      entityName: createSceneEntityId('test'),
    });
    expect(createSceneEntityComponent).not.toBeCalled();
  });

  it('should call createSceneEntity with expected input when DynamicSceneAlpha is on', () => {
    setTwinMakerSceneMetadataModule(mockMetadataModule as unknown as TwinMakerSceneMetadataModule);
    setFeatureConfig({ [COMPOSER_FEATURES.DynamicSceneAlpha]: true });
    (createSceneEntityComponent as jest.Mock).mockReturnValue('random');

    createSceneRootEntity({
      ruleMap: {},
      version: '1',
    });

    expect(createSceneEntity).toBeCalledWith({
      workspaceId: undefined,
      entityId: createSceneEntityId('test'),
      parentEntityId: SCENE_ROOT_ENTITY_ID,
      entityName: createSceneEntityId('test'),
      components: { [SCENE_ROOT_ENTITY_COMPONENT_NAME]: 'random' },
    });
    expect(createSceneEntityComponent).toBeCalledTimes(1);
  });
});

describe('updateSceneRootEntity', () => {
  const updateSceneEntity = jest.fn();
  const mockMetadataModule: Partial<TwinMakerSceneMetadataModule> = {
    updateSceneEntity,
  };

  it('should call updateSceneEntity with expected input', () => {
    setTwinMakerSceneMetadataModule(mockMetadataModule as unknown as TwinMakerSceneMetadataModule);
    const mockSceneDocument = { specVersion: '1.0', version: '1', ruleMap: {} };
    const mockComponentUpdates = {
      componentTypeId: 'type.scene',
      propertyUpdates: {},
    };
    (updateSceneEntityComponent as jest.Mock).mockReturnValue(mockComponentUpdates);

    updateSceneRootEntity('scene-root-id', mockSceneDocument);

    expect(updateSceneEntity).toBeCalledWith({
      workspaceId: undefined,
      entityId: 'scene-root-id',
      componentUpdates: {
        [SCENE_ROOT_ENTITY_COMPONENT_NAME]: mockComponentUpdates,
      },
    });
    expect(updateSceneEntityComponent).toBeCalledWith(mockSceneDocument);
  });
});

describe('checkIfEntityExists', () => {
  const getSceneEntity = jest.fn();
  const mockMetadataModule: Partial<TwinMakerSceneMetadataModule> = {
    getSceneEntity,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return true when entity exist', async () => {
    getSceneEntity.mockResolvedValue(undefined);

    const result = await checkIfEntityExists('eid', mockMetadataModule as TwinMakerSceneMetadataModule);

    expect(result).toEqual(true);
  });

  it('should return false when entity does not exist', async () => {
    getSceneEntity.mockRejectedValue(new ResourceNotFoundException({ $metadata: {}, message: 'does not exist' }));

    const result = await checkIfEntityExists('eid', mockMetadataModule as TwinMakerSceneMetadataModule);

    expect(result).toEqual(false);
  });

  it('should return exception when api rejects', async () => {
    const error = new Error('entity does not exist');
    getSceneEntity.mockRejectedValue(error);

    try {
      await checkIfEntityExists('eid', mockMetadataModule as TwinMakerSceneMetadataModule);
    } catch (e) {
      expect(e).toEqual(error);
    }
  });
});

describe('prepareWorkspace', () => {
  const createSceneEntity = jest.fn();
  const getSceneEntity = jest.fn();
  const mockMetadataModule: Partial<TwinMakerSceneMetadataModule> = {
    createSceneEntity,
    getSceneEntity,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call createSceneEntity to create scenes root entity', async () => {
    getSceneEntity.mockImplementation(({ entityId }) => {
      if (entityId === SCENE_ROOT_ENTITY_ID) {
        throw new ResourceNotFoundException({ $metadata: {}, message: 'does not exist' });
      }
      return;
    });

    await prepareWorkspace(mockMetadataModule as TwinMakerSceneMetadataModule);

    expect(createSceneEntity).toBeCalledTimes(1);
    expect(createSceneEntity).toBeCalledWith({
      entityId: SCENE_ROOT_ENTITY_ID,
      entityName: SCENE_ROOT_ENTITY_NAME,
    });
  });

  it('should call createSceneEntity to create layers root entity', async () => {
    getSceneEntity.mockImplementation(({ entityId }) => {
      if (entityId === LAYER_ROOT_ENTITY_ID) {
        throw new ResourceNotFoundException({ $metadata: {}, message: 'does not exist' });
      }
      return;
    });

    await prepareWorkspace(mockMetadataModule as TwinMakerSceneMetadataModule);

    expect(createSceneEntity).toBeCalledTimes(1);
    expect(createSceneEntity).toBeCalledWith({
      entityId: LAYER_ROOT_ENTITY_ID,
      entityName: LAYER_ROOT_ENTITY_NAME,
    });
  });

  it('should call createSceneEntity to create both layers and scenes root entities', async () => {
    getSceneEntity.mockRejectedValue(new ResourceNotFoundException({ $metadata: {}, message: 'does not exist' }));

    await prepareWorkspace(mockMetadataModule as TwinMakerSceneMetadataModule);

    expect(createSceneEntity).toBeCalledTimes(2);
    expect(createSceneEntity).toBeCalledWith({
      entityId: LAYER_ROOT_ENTITY_ID,
      entityName: LAYER_ROOT_ENTITY_NAME,
    });
    expect(createSceneEntity).toBeCalledWith({
      entityId: SCENE_ROOT_ENTITY_ID,
      entityName: SCENE_ROOT_ENTITY_NAME,
    });
  });

  it('should not call createSceneEntity when root entities exist', async () => {
    getSceneEntity.mockResolvedValue(undefined);

    await prepareWorkspace(mockMetadataModule as TwinMakerSceneMetadataModule);

    expect(createSceneEntity).not.toBeCalled();
  });
});

describe('isDynamicNode', () => {
  it('should return true', () => {
    expect(
      isDynamicNode({
        properties: {
          [SceneNodeRuntimeProperty.LayerIds]: ['layer'],
        },
      } as ISceneNodeInternal),
    ).toEqual(true);
  });

  it('should return false', () => {
    expect(
      isDynamicNode({
        properties: {
          [SceneNodeRuntimeProperty.LayerIds]: [] as string[],
        },
      } as ISceneNodeInternal),
    ).toEqual(false);
    expect(isDynamicNode({ properties: {} } as ISceneNodeInternal)).toEqual(false);
  });
});

describe('isDynamicScene', () => {
  it('should return true', () => {
    expect(
      isDynamicScene({
        properties: {
          [KnownSceneProperty.LayerIds]: ['layer'],
          [KnownSceneProperty.SceneRootEntityId]: 'scene-root',
        },
      } as ISceneDocumentInternal),
    ).toEqual(true);
  });

  it('should return false', () => {
    expect(
      isDynamicScene({
        properties: {
          [KnownSceneProperty.LayerIds]: ['layer'],
        },
      } as ISceneDocumentInternal),
    ).toEqual(false);
    expect(
      isDynamicScene({
        properties: {
          [KnownSceneProperty.SceneRootEntityId]: 'scene-root',
        },
      } as ISceneDocumentInternal),
    ).toEqual(false);
    expect(
      isDynamicScene({
        properties: {},
      } as ISceneDocumentInternal),
    ).toEqual(false);
  });
});

describe('staticNodeCount', () => {
  it('should return 0', () => {
    expect(staticNodeCount({})).toEqual(0);
    expect(staticNodeCount({ dynamic: { properties: { layerIds: ['layer'] } } as ISceneNodeInternal })).toEqual(0);
  });

  it('should return correct number', () => {
    expect(staticNodeCount({})).toEqual(0);
    expect(
      staticNodeCount({
        dynamic: { properties: { layerIds: ['layer'] } } as ISceneNodeInternal,
        static1: { properties: { layerIds: [] } } as unknown as ISceneNodeInternal,
        static2: { properties: {} } as ISceneNodeInternal,
      }),
    ).toEqual(2);
  });
});

describe('convertAllNodesToEntities', () => {
  const dynamicNode = { ...defaultNode, properties: { [SceneNodeRuntimeProperty.LayerIds]: ['layer'] } };
  const staticNode: ISceneNodeInternal = {
    ...defaultNode,
    ref: 'staticNode',
    parentRef: 'parent',
    transform: {
      position: [1, 1, 1],
      rotation: [2, 2, 2],
      scale: [3, 3, 3],
    },
  };
  const onSuccess = jest.fn();
  const onFailure = jest.fn();

  const getSceneEntity = jest.fn();
  const mockMetadataModule: Partial<TwinMakerSceneMetadataModule> = {
    getSceneEntity,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    setTwinMakerSceneMetadataModule(mockMetadataModule as unknown as TwinMakerSceneMetadataModule);
    (createNodeEntity as jest.Mock).mockResolvedValue(null);
    (getFinalNodeTransform as jest.Mock).mockImplementation((n, _, __) => n.transform);
    (findComponentByType as jest.Mock).mockReturnValue(false);
  });

  it('should not call createNodeEntity when node is dynamic', async () => {
    const document: Partial<ISceneDocumentInternal> = {
      nodeMap: {
        dynamicNode,
      },
    };
    convertAllNodesToEntities({
      document: document as ISceneDocumentInternal,
      onSuccess,
      onFailure,
      getObject3DBySceneNodeRef: jest.fn().mockReturnValue(new Object3D()),
      sceneRootEntityId: 'scene-root',
      layerId: 'layer',
    });

    await flushPromises();

    expect(createNodeEntity).not.toBeCalled();
    expect(onSuccess).not.toBeCalled();
    expect(onFailure).not.toBeCalled();
  });

  it('should not call createNodeEntity when object 3D is not found', async () => {
    const document: Partial<ISceneDocumentInternal> = {
      nodeMap: {
        staticNode,
      },
    };

    convertAllNodesToEntities({
      document: document as ISceneDocumentInternal,
      onSuccess,
      onFailure,
      getObject3DBySceneNodeRef: jest.fn().mockReturnValue(undefined),
      sceneRootEntityId: 'scene-root',
      layerId: 'layer',
    });

    await flushPromises();

    expect(createNodeEntity).not.toBeCalled();
    expect(onSuccess).not.toBeCalled();
    expect(onFailure).toBeCalledTimes(1);
  });

  it('should call createNodeEntity when node is static', async () => {
    const document: Partial<ISceneDocumentInternal> = {
      nodeMap: {
        staticNode,
      },
    };

    convertAllNodesToEntities({
      document: document as ISceneDocumentInternal,
      onSuccess,
      onFailure,
      getObject3DBySceneNodeRef: jest.fn().mockReturnValue(new Object3D()),
      sceneRootEntityId: 'scene-root',
      layerId: 'layer',
    });

    await flushPromises();

    expect(createNodeEntity).toBeCalledTimes(1);
    expect(onSuccess).toBeCalledTimes(1);
    expect(onFailure).not.toBeCalled();
    expect(onSuccess).toBeCalledWith({
      ...staticNode,
      parentRef: undefined,
      properties: {
        ...staticNode.properties,
        [SceneNodeRuntimeProperty.LayerIds]: ['layer'],
      },
    });
  });

  it('should call createNodeEntity and use a world transform', async () => {
    const document: Partial<ISceneDocumentInternal> = {
      nodeMap: {
        staticNode,
      },
    };
    const worldTransform = { position: [4, 4, 4], rotation: [5, 5, 5], scale: [6, 6, 6] };
    (getFinalNodeTransform as jest.Mock).mockImplementation((_, __, ___) => worldTransform);
    (findComponentByType as jest.Mock).mockReturnValue(false);

    convertAllNodesToEntities({
      document: document as ISceneDocumentInternal,
      onSuccess,
      onFailure,
      getObject3DBySceneNodeRef: jest.fn().mockReturnValue(new Object3D()),
      sceneRootEntityId: 'scene-root',
      layerId: 'layer',
    });

    await flushPromises();

    expect(createNodeEntity).toBeCalledTimes(1);
    expect(onSuccess).toBeCalledTimes(1);
    expect(onFailure).not.toBeCalled();
    expect(onSuccess).toBeCalledWith({
      ...staticNode,
      parentRef: undefined,
      transform: worldTransform,
      properties: {
        ...staticNode.properties,
        [SceneNodeRuntimeProperty.LayerIds]: ['layer'],
      },
    });
  });

  it('should call createNodeEntity and use a relative transform for sub model node', async () => {
    const document: Partial<ISceneDocumentInternal> = {
      nodeMap: {
        staticNode,
      },
    };
    const worldTransform = { position: [4, 4, 4], rotation: [5, 5, 5], scale: [6, 6, 6] };
    (getFinalNodeTransform as jest.Mock).mockImplementation((_, __, ___) => worldTransform);
    (findComponentByType as jest.Mock).mockReturnValue(true);
    getSceneEntity.mockResolvedValue(true);
    jest.useFakeTimers();

    convertAllNodesToEntities({
      document: document as ISceneDocumentInternal,
      onSuccess,
      onFailure,
      getObject3DBySceneNodeRef: jest.fn().mockReturnValue(new Object3D()),
      sceneRootEntityId: 'scene-root',
      layerId: 'layer',
    });

    jest.advanceTimersByTime(1000);
    await flushPromises();

    expect(onFailure).not.toBeCalled();
    expect(onSuccess).toBeCalledTimes(1);
    expect(createNodeEntity).toBeCalledTimes(1);
    expect(getFinalNodeTransform).not.toBeCalled();
    expect(onSuccess).toBeCalledWith({
      ...staticNode,
      properties: {
        ...staticNode.properties,
        [SceneNodeRuntimeProperty.LayerIds]: ['layer'],
      },
    });
  });

  it('should call onFailure when parent entity does not available after retries', async () => {
    const document: Partial<ISceneDocumentInternal> = {
      nodeMap: {
        staticNode,
      },
    };
    const worldTransform = { position: [4, 4, 4], rotation: [5, 5, 5], scale: [6, 6, 6] };
    (getFinalNodeTransform as jest.Mock).mockImplementation((_, __, ___) => worldTransform);
    (findComponentByType as jest.Mock).mockReturnValue(true);
    getSceneEntity.mockRejectedValue(new ResourceNotFoundException({ $metadata: {}, message: 'does not exist' }));
    jest.useFakeTimers();
    let error;
    onFailure.mockImplementation((node, err) => (error = err));

    convertAllNodesToEntities({
      document: document as ISceneDocumentInternal,
      onSuccess,
      onFailure,
      getObject3DBySceneNodeRef: jest.fn().mockReturnValue(new Object3D()),
      sceneRootEntityId: 'scene-root',
      layerId: 'layer',
    });

    // Mock 4 interval executions, need to flush promises in between to get the promise result before next execution.
    jest.advanceTimersByTime(1000);
    await flushPromises();
    jest.advanceTimersByTime(1000);
    await flushPromises();
    jest.advanceTimersByTime(1000);
    await flushPromises();
    jest.advanceTimersByTime(1000);
    await flushPromises();

    expect(onSuccess).not.toBeCalled();
    expect(onFailure).toBeCalledTimes(1);
    expect(createNodeEntity).not.toBeCalled();
    expect(getFinalNodeTransform).not.toBeCalled();
    expect(onFailure).toBeCalledWith(
      {
        ...staticNode,
        properties: {
          ...staticNode.properties,
          [SceneNodeRuntimeProperty.LayerIds]: ['layer'],
        },
      },
      expect.anything(),
    );
    expect(error.message).toContain('Parent entity does not exist');
  });

  it('should call onFailure when createNodeEntity failed', async () => {
    const document: Partial<ISceneDocumentInternal> = {
      nodeMap: {
        staticNode,
      },
    };
    const error = new Error('createNodeEntity failed');
    (createNodeEntity as jest.Mock).mockRejectedValue(error);
    const onFailure = jest.fn();

    convertAllNodesToEntities({
      document: document as ISceneDocumentInternal,
      onSuccess,
      onFailure,
      getObject3DBySceneNodeRef: jest.fn().mockReturnValue(new Object3D()),
      sceneRootEntityId: 'scene-root',
      layerId: 'layer',
    });

    await flushPromises();

    expect(createNodeEntity).toBeCalledTimes(1);
    expect(onSuccess).not.toBeCalled();
    expect(onFailure).toBeCalledTimes(1);
    expect(onFailure).toBeCalledWith(
      {
        ...staticNode,
        parentRef: undefined,
        properties: {
          ...staticNode.properties,
          [SceneNodeRuntimeProperty.LayerIds]: ['layer'],
        },
      },
      error,
    );
  });
});
