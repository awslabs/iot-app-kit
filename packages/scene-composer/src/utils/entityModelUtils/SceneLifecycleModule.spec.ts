import { type TwinMakerSceneMetadataModule } from '@iot-app-kit/source-iottwinmaker';

import { setTwinMakerSceneMetadataModule } from '../../common/GlobalSettings';
import { SCENE_ROOT_ENTITY_COMPONENT_NAME } from '../../common/entityModelConstants';
import { SceneCapabilities } from '../../common/sceneModelConstants';
import { emptyScene } from '../emptyScene';

import { SceneLifecycleModule } from './SceneLifecycleModule';
import { updateSceneEntityComponent } from './sceneComponent';

describe('createDynamicScene', () => {
  const createScene = jest.fn();
  const getSceneInfo = jest.fn().mockResolvedValue({
    workspaceId: 'workspace-id',
    sceneId: 'dynamic-scene',
    contentLocation: undefined,
    arn: 'dynamic-scene-arn',
    creationDateTime: new Date(2022, 2, 1),
    updateDateTime: new Date(2022, 2, 1),
    capabilities: ['DYNAMIC_SCENE'],
    sceneMetadata: { sceneRootEntityId: 'example-dynamic-scene-entity-id' },
  });
  const updateSceneEntity = jest.fn().mockResolvedValue({
    updateDateTime: new Date(2022, 2, 1),
    state: 'ACTIVE',
  });
  const createSceneEntity = jest.fn().mockResolvedValue({
    entityId: 'dynamic-scene-entity-id',
    arn: 'dynamic-scene-entity-arn',
    creationDateTime: new Date(2022, 2, 1),
    state: 'ACTIVE',
  });
  const getSceneId = jest.fn().mockReturnValue('dynamic-scene-entity-id');
  const mockMetadataModule: Partial<TwinMakerSceneMetadataModule> = {
    createScene,
    getSceneInfo,
    updateSceneEntity,
    createSceneEntity,
    getSceneId,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const sceneLifecycleModule = new SceneLifecycleModule();

  it('should call correct APIs with expected input', async () => {
    setTwinMakerSceneMetadataModule(mockMetadataModule as unknown as TwinMakerSceneMetadataModule);

    await sceneLifecycleModule.createDynamicScene(mockMetadataModule);

    expect(createScene).toBeCalledWith({ capabilities: [SceneCapabilities.DYNAMIC_SCENE] });
    expect(getSceneInfo).toBeCalledWith();
    const emptySceneSettings = {
      ...emptyScene,
      properties: {
        ...emptyScene.properties,
      },
    };
    expect(updateSceneEntity).toBeCalledWith({
      entityId: 'example-dynamic-scene-entity-id',
      componentUpdates: {
        [SCENE_ROOT_ENTITY_COMPONENT_NAME]: updateSceneEntityComponent(emptySceneSettings),
      },
    });
    expect(createScene).toBeCalledTimes(1);
    expect(getSceneInfo).toBeCalledTimes(1);
    expect(updateSceneEntity).toBeCalledTimes(1);
  });
});
