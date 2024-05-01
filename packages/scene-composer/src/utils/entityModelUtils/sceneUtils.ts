import {
  CreateEntityCommandInput,
  CreateEntityCommandOutput,
  ResourceNotFoundException,
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
import { COMPOSER_FEATURES, ISceneDocument, KnownComponentType, KnownSceneProperty } from '../../interfaces';

import { createNodeEntity } from './createNodeEntity';
import { createSceneEntityComponent, updateSceneEntityComponent } from './sceneComponent';

export const createSceneEntityId = (sceneName: string): string => {
  return `SCENE_${sceneName}_${generateUUID()}`;
};

export const createSceneRootEntity = (
  scene: Omit<ISceneDocument, 'nodeMap' | 'rootNodeRefs'>,
): Promise<CreateEntityCommandOutput> | undefined => {
  if (!getGlobalSettings().twinMakerSceneMetadataModule) {
    return;
  }

  const isDynamicSceneAlphaEnabled = getGlobalSettings().featureConfig[COMPOSER_FEATURES.DynamicSceneAlpha];
  const sceneName = getGlobalSettings().twinMakerSceneMetadataModule!.getSceneId();
  const sceneEntityId = createSceneEntityId(sceneName);
  const input: CreateEntityCommandInput = {
    workspaceId: undefined,
    entityId: sceneEntityId,
    parentEntityId: SCENE_ROOT_ENTITY_ID,
    entityName: sceneEntityId,
    components: isDynamicSceneAlphaEnabled
      ? {
          [SCENE_ROOT_ENTITY_COMPONENT_NAME]: createSceneEntityComponent(scene),
        }
      : undefined,
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

export const checkIfEntityExists = async (
  entityId: string,
  sceneMetadataModule: TwinMakerSceneMetadataModule,
): Promise<boolean> => {
  try {
    setTimeout(() => { 
      console.log('sleep 1 second for ', entityId);
    }, Math.floor(5000 + Math.random()*1000));  
    const result = await sceneMetadataModule.getSceneEntity({ entityId });
    console.log('entity: ', entityId, ' exists with result: ', result);
    return true;
  } catch (e) {
    if (e instanceof ResourceNotFoundException) {
      return false;
    }
    throw e;
  }
};

export const prepareWorkspace = async (sceneMetadataModule: TwinMakerSceneMetadataModule): Promise<void> => {
  // Check if root entities exist
  const checkRoots = await Promise.all([
    checkIfEntityExists(SCENE_ROOT_ENTITY_ID, sceneMetadataModule),
    checkIfEntityExists(LAYER_ROOT_ENTITY_ID, sceneMetadataModule),
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
}) => {
  const subModelRequests: ISceneNodeInternal[] = [];

  const sceneMetadataModule = getGlobalSettings().twinMakerSceneMetadataModule;

  Object.keys(document.nodeMap).forEach(async (nodeRef) => {
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
        //const worldTransform = getFinalNodeTransform(node, object3D, null);

        const worldTransformNode: ISceneNodeInternal = {
          ...node,
          parentRef: node.parentRef?? sceneRootEntityId,
          properties: {
            ...node.properties,
            [SceneNodeRuntimeProperty.LayerIds]: [layerId!],
          },
        };

        console.log('create entity: ', worldTransformNode.parentRef, ' : ', worldTransformNode.ref);

        let retryCounts = 0;
        const interval = setInterval(async () => {
          retryCounts++;
          try {
            setTimeout(() => { 
              console.log('sleep 1 second for ', node.ref);
            }, Math.floor(5000 + Math.random()*2000));  
            const res = await checkIfEntityExists(worldTransformNode.parentRef!, sceneMetadataModule!);
            if (res) {
              console.log('parent Entity ', worldTransformNode.parentRef, ' exists');
              try {
                await createNodeEntity(worldTransformNode, worldTransformNode.parentRef?? sceneRootEntityId, layerId);
                onSuccess?.(worldTransformNode);
                console.log('parent: ', worldTransformNode.parentRef, ' create entity: ', worldTransformNode.ref);
              } catch(error)  {
                onFailure?.(worldTransformNode, error as Error);
              }
              clearInterval(interval);
              return;
            }
            
          } catch (error) {
            clearInterval(interval);
            onFailure?.(node, error as Error);
            return; 
          }

          if (retryCounts > 10) {
            clearInterval(interval);
            onFailure?.(node, new Error('Parent entity ' + worldTransformNode.parentRef + ' does not exist in the workspace'));
            return;
          }
        }, Math.floor(5000 + Math.random()*10000));
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
      try {
        const res = await checkIfEntityExists(req.parentRef!, getGlobalSettings().twinMakerSceneMetadataModule!);
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
      } catch (e) {
        clearInterval(interval);
        onFailure?.(req, e as Error);
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
