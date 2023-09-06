import { CreateEntityCommandInput } from '@aws-sdk/client-iottwinmaker';

import { SCENE_ROOT_ENTITY_ID } from '../../common/entityModelConstants';
import { getGlobalSettings } from '../../common/GlobalSettings';
import { generateUUID } from '../mathUtils';

export const createSceneEntityId = (sceneName: string) => {
  return `SCENE_${sceneName}_${generateUUID()}`;
};

export const createSceneRootEntity = () => {
  if (!getGlobalSettings().twinMakerSceneMetadataModule) {
    return;
  }

  const sceneName = getGlobalSettings().twinMakerSceneMetadataModule!.getSceneId();
  const sceneEntityId = createSceneEntityId(sceneName);
  const input: CreateEntityCommandInput = {
    workspaceId: undefined,
    entityId: sceneEntityId,
    parentEntityId: SCENE_ROOT_ENTITY_ID,
    entityName: sceneEntityId,
  };

  return getGlobalSettings().twinMakerSceneMetadataModule!.createSceneEntity(input);
};
