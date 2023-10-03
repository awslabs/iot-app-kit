import { CreateEntityCommandInput, CreateEntityCommandOutput } from '@aws-sdk/client-iottwinmaker';
import { TwinMakerSceneMetadataModule } from '@iot-app-kit/source-iottwinmaker';
import { isEmpty } from 'lodash';

import {
  LAYER_ROOT_ENTITY_ID,
  LAYER_ROOT_ENTITY_NAME,
  SCENE_ROOT_ENTITY_ID,
  SCENE_ROOT_ENTITY_NAME,
} from '../../common/entityModelConstants';
import { getGlobalSettings } from '../../common/GlobalSettings';
import { generateUUID } from '../mathUtils';
import { ISceneNodeInternal } from '../../store';

export const createSceneEntityId = (sceneName: string): string => {
  return `SCENE_${sceneName}_${generateUUID()}`;
};

export const createSceneRootEntity = (): Promise<CreateEntityCommandOutput> | undefined => {
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

export const checkIfEntityAvailable = async (
  entityId: string,
  sceneMetadataModule: TwinMakerSceneMetadataModule,
): Promise<boolean> => {
  try {
    await sceneMetadataModule.getSceneEntity({ entityId });
    return true;
  } catch (e) {
    return false;
  }
};

export const prepareWorkspace = async (sceneMetadataModule: TwinMakerSceneMetadataModule): Promise<void> => {
  // Check if root entities exist
  const checkRoots = await Promise.all([
    checkIfEntityAvailable(SCENE_ROOT_ENTITY_ID, sceneMetadataModule),
    checkIfEntityAvailable(LAYER_ROOT_ENTITY_ID, sceneMetadataModule),
  ]);

  // Create root entities that do not exist
  const createRootRequests: Promise<CreateEntityCommandOutput>[] = [];
  if (!checkRoots[0]) {
    createRootRequests.push(
      sceneMetadataModule.createSceneEntity({ entityId: SCENE_ROOT_ENTITY_ID, entityName: SCENE_ROOT_ENTITY_NAME }),
    );
  }
  if (!checkRoots[1]) {
    createRootRequests.push(
      sceneMetadataModule.createSceneEntity({ entityId: LAYER_ROOT_ENTITY_ID, entityName: LAYER_ROOT_ENTITY_NAME }),
    );
  }
  await Promise.all(createRootRequests);
};

export const isDynamicNode = (node?: ISceneNodeInternal): boolean => {
  return !isEmpty(node?.properties.layerIds);
};
