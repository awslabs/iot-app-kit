import {
  CreateEntityCommandInput,
  CreateEntityCommandOutput,
  UpdateEntityCommandInput,
  UpdateEntityCommandOutput,
} from '@aws-sdk/client-iottwinmaker';
import { TwinMakerSceneMetadataModule } from '@iot-app-kit/source-iottwinmaker';
import { isEmpty } from 'lodash';

import {
  LAYER_ROOT_ENTITY_ID,
  LAYER_ROOT_ENTITY_NAME,
  SCENE_ROOT_ENTITY_COMPONENT_NAME,
  SCENE_ROOT_ENTITY_ID,
  SCENE_ROOT_ENTITY_NAME,
} from '../../common/entityModelConstants';
import { getGlobalSettings } from '../../common/GlobalSettings';
import { generateUUID } from '../mathUtils';
import { ISceneDocumentInternal, ISceneNodeInternal } from '../../store';
import { SceneNodeRuntimeProperty } from '../../store/internalInterfaces';
import { findComponentByType, getFinalNodeTransform } from '../nodeUtils';
import { ISceneDocument, KnownComponentType, KnownSceneProperty } from '../../interfaces';

import { createNodeEntity } from './createNodeEntity';
import { updateSceneEntityComponent } from './sceneComponent';

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

export const updateSceneRootEntity = (
  sceneEntityId: string,
  scene: Omit<ISceneDocument, 'nodeMap' | 'rootNodeRefs'>,
): Promise<UpdateEntityCommandOutput> | undefined => {
  if (!getGlobalSettings().twinMakerSceneMetadataModule) {
    return;
  }

  const input: UpdateEntityCommandInput = {
    workspaceId: undefined,
    entityId: sceneEntityId,
    componentUpdates: {
      [SCENE_ROOT_ENTITY_COMPONENT_NAME]: updateSceneEntityComponent(scene),
    },
  };

  return getGlobalSettings().twinMakerSceneMetadataModule!.updateSceneEntity(input);
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

export const isDynamicScene = (document?: ISceneDocumentInternal): boolean => {
  return (
    !isEmpty(document?.properties?.[KnownSceneProperty.LayerIds]) &&
    !isEmpty(document?.properties?.[KnownSceneProperty.SceneRootEntityId])
  );
};

export const staticNodeCount = (nodeMap: { [key: string]: ISceneNodeInternal }): number => {
  return Object.values(nodeMap).filter((node) => !isDynamicNode(node)).length;
};

export const convertAllNodesToEntities = ({
  document,
  sceneRootEntityId,
  layerId,
  getObject3DBySceneNodeRef,
  onSuccess,
  onFailure,
}: {
  document: ISceneDocumentInternal;
  sceneRootEntityId: string;
  layerId: string;
  getObject3DBySceneNodeRef: (nodeRef: string) => THREE.Object3D | undefined;
  onSuccess?: (node: ISceneNodeInternal) => void;
  onFailure?: (node: ISceneNodeInternal, error: Error) => void;
}): void => {
  const subModelRequests: ISceneNodeInternal[] = [];

  Object.keys(document.nodeMap).forEach((nodeRef) => {
    const node = document.nodeMap[nodeRef];
    const object3D = getObject3DBySceneNodeRef(nodeRef);

    if (isDynamicNode(node)) {
      return;
    }

    if (!object3D) {
      onFailure?.(node, new Error('Object not found'));
    } else {
      // Create sub model nodes in the end to ensure their parents are created before them
      if (findComponentByType(node, KnownComponentType.SubModelRef)) {
        subModelRequests.push({
          ...node,
          properties: {
            ...node.properties,
            [SceneNodeRuntimeProperty.LayerIds]: [layerId!],
          },
        });
      } else {
        // Use world transform before supporting hierarchy relationship
        const worldTransform = getFinalNodeTransform(node, object3D, null);

        const worldTransformNode: ISceneNodeInternal = {
          ...node,
          parentRef: undefined,
          transform: worldTransform,
          properties: {
            ...node.properties,
            [SceneNodeRuntimeProperty.LayerIds]: [layerId!],
          },
        };

        createNodeEntity(worldTransformNode, sceneRootEntityId, layerId)
          .then(() => {
            onSuccess?.(worldTransformNode);
          })
          .catch((error) => {
            onFailure?.(worldTransformNode, error);
          });
      }
    }
  });

  // Make sure the parent entity of sub model node is available before creating sub model entity
  subModelRequests.forEach(async (req) => {
    if (!req.parentRef) {
      onFailure?.(req, new Error('No parentRef found'));
      return;
    }

    let retryCounts = 0;
    const interval = setInterval(async () => {
      retryCounts++;
      const res = await checkIfEntityAvailable(req.parentRef!, getGlobalSettings().twinMakerSceneMetadataModule!);
      if (res) {
        createNodeEntity(req, req.parentRef || sceneRootEntityId, layerId)
          .then(() => {
            onSuccess?.(req);
          })
          .catch((error) => {
            onFailure?.(req, error);
          });

        clearInterval(interval);
        return;
      }

      if (retryCounts > 3) {
        clearInterval(interval);
        onFailure?.(req, new Error('Parent entity does not exist in the workspace'));
        return;
      }
    }, 1000);
  });
};
