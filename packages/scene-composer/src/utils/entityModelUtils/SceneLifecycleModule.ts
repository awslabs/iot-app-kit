import { type GetSceneCommandOutput } from '@aws-sdk/client-iottwinmaker';
import { type TwinMakerSceneMetadataModule } from '@iot-app-kit/source-iottwinmaker';

import { SCENE_ROOT_ENTITY_COMPONENT_NAME } from '../../common/entityModelConstants';
import { SceneCapabilities } from '../../common/sceneModelConstants';
import { KnownSceneProperty } from '../../interfaces';
import { emptyScene } from '../emptyScene';

import { updateSceneEntityComponent } from './sceneComponent';

export class SceneLifecycleModule {
  createDynamicScene = async (sceneMetadataModule: TwinMakerSceneMetadataModule): Promise<GetSceneCommandOutput> => {
    await sceneMetadataModule.createScene({
      capabilities: [SceneCapabilities.DYNAMIC_SCENE],
    });
    const sceneInfo = await sceneMetadataModule.getSceneInfo();
    const emptySceneSettings = {
      ...emptyScene,
      properties: {
        ...emptyScene.properties,
      },
    };
    const entityComponentModelDefault = updateSceneEntityComponent(emptySceneSettings);
    const sceneRootEntityId = sceneInfo?.sceneMetadata?.[KnownSceneProperty.SceneRootEntityId];
    await sceneMetadataModule.updateSceneEntity({
      entityId: sceneRootEntityId,
      componentUpdates: {
        [SCENE_ROOT_ENTITY_COMPONENT_NAME]: entityComponentModelDefault,
      },
    });
    return sceneInfo;
  };
}
