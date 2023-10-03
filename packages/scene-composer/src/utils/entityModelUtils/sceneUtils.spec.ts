import { TwinMakerSceneMetadataModule } from '@iot-app-kit/source-iottwinmaker';

import { setTwinMakerSceneMetadataModule } from '../../common/GlobalSettings';
import {
  LAYER_ROOT_ENTITY_ID,
  LAYER_ROOT_ENTITY_NAME,
  SCENE_ROOT_ENTITY_ID,
  SCENE_ROOT_ENTITY_NAME,
} from '../../common/entityModelConstants';
import { ISceneNodeInternal, SceneNodeRuntimeProperty } from '../../store/internalInterfaces';

import {
  checkIfEntityAvailable,
  createSceneEntityId,
  createSceneRootEntity,
  isDynamicNode,
  prepareWorkspace,
} from './sceneUtils';

jest.mock('../mathUtils', () => ({
  generateUUID: jest.fn(() => 'random-uuid'),
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

  it('should call createSceneEntity with expected input', () => {
    setTwinMakerSceneMetadataModule(mockMetadataModule as unknown as TwinMakerSceneMetadataModule);

    createSceneRootEntity();

    expect(createSceneEntity).toBeCalledWith({
      workspaceId: undefined,
      entityId: createSceneEntityId('test'),
      parentEntityId: SCENE_ROOT_ENTITY_ID,
      entityName: createSceneEntityId('test'),
    });
  });
});

describe('checkIfEntityAvailable', () => {
  const getSceneEntity = jest.fn();
  const mockMetadataModule: Partial<TwinMakerSceneMetadataModule> = {
    getSceneEntity,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return true when entity exist', async () => {
    getSceneEntity.mockResolvedValue(undefined);

    const result = await checkIfEntityAvailable('eid', mockMetadataModule as TwinMakerSceneMetadataModule);

    expect(result).toEqual(true);
  });

  it('should return false when entity does not exist', async () => {
    getSceneEntity.mockRejectedValue(() => new Error('entity does not exist'));

    const result = await checkIfEntityAvailable('eid', mockMetadataModule as TwinMakerSceneMetadataModule);

    expect(result).toEqual(false);
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
        throw new Error('entity does not exist');
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
        throw new Error('entity does not exist');
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
    getSceneEntity.mockRejectedValue(() => new Error('entity does not exist'));

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
