import { TwinMakerSceneMetadataModule } from '@iot-app-kit/source-iottwinmaker';

import { setTwinMakerSceneMetadataModule } from '../../common/GlobalSettings';
import { SCENE_ROOT_ENTITY_ID } from '../../common/entityModelConstants';

import { createSceneEntityId, createSceneRootEntity } from './sceneUtils';

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
