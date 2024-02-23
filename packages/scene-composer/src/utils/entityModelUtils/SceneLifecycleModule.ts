import { GetSceneCommandOutput } from '@aws-sdk/client-iottwinmaker';
import { TwinMakerSceneMetadataModule } from '@iot-app-kit/source-iottwinmaker';

import { SCENE_ROOT_ENTITY_COMPONENT_NAME, LayerType } from '../../common/entityModelConstants';
import { SceneCapabilities } from '../../common/sceneModelConstants';
import { KnownSceneProperty } from '../../interfaces';
import { emptyScene } from '../emptyScene';
import { createLayer } from '../../utils/entityModelUtils/sceneLayerUtils';

import { updateSceneEntityComponent } from './sceneComponent';

export class SceneLifecycleModule {
  createDynamicScene = async (sceneMetadataModule: TwinMakerSceneMetadataModule): Promise<GetSceneCommandOutput> => {
    await sceneMetadataModule.createScene({
      capabilities: [SceneCapabilities.DYNAMIC_SCENE],
    });
    const sceneInfo = await sceneMetadataModule.getSceneInfo();
    const layerName = `${sceneMetadataModule?.getSceneId()}_Default`;
    const layer = await createLayer(layerName, LayerType.Relationship);
    const layerId = layer?.entityId;
    const emptySceneSettings = {
      ...emptyScene,
      properties: {
        ...emptyScene.properties,
        [KnownSceneProperty.LayerIds]: [layerId],
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
