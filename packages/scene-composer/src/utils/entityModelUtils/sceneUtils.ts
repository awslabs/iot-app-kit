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
  SCENE_ROOT_ENTITY_COMPONENT_NAME,
  SCENE_ROOT_ENTITY_ID,
  SCENE_ROOT_ENTITY_NAME,
  RESERVED_LAYER_ID,
} from '../../common/entityModelConstants';
import { getGlobalSettings } from '../../common/GlobalSettings';
import { generateUUID } from '../mathUtils';
import { ISceneDocumentInternal, ISceneNodeInternal } from '../../store';
import { COMPOSER_FEATURES, ISceneDocument, KnownSceneProperty } from '../../interfaces';
import { SceneNodeRuntimeProperty } from '../../store/internalInterfaces';

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
    await sceneMetadataModule.getSceneEntity({ entityId });
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
  const checkRoots = await checkIfEntityExists(SCENE_ROOT_ENTITY_ID, sceneMetadataModule);

  // Create root entities that do not exist
  if (!checkRoots) {
    await sceneMetadataModule.createSceneEntity({ entityId: SCENE_ROOT_ENTITY_ID, entityName: SCENE_ROOT_ENTITY_NAME });
  }
};

export const isDynamicNode = (node?: ISceneNodeInternal): boolean => {
  return !isEmpty(node?.properties.layerIds);
};

export const isDynamicScene = (document?: ISceneDocumentInternal): boolean => {
  return !isEmpty(document?.properties?.[KnownSceneProperty.SceneRootEntityId]);
};

export const staticNodeCount = (nodeMap: { [key: string]: ISceneNodeInternal }): number => {
  return Object.values(nodeMap).filter((node) => !isDynamicNode(node)).length;
};

export const convertAllNodesToEntities = async ({
  document,
  sceneRootEntityId,
  getObject3DBySceneNodeRef,
  onSuccess,
  onFailure,
}: {
  document: ISceneDocumentInternal;
  sceneRootEntityId: string;
  getObject3DBySceneNodeRef: (nodeRef: string) => THREE.Object3D | undefined;
  onSuccess?: (node: ISceneNodeInternal) => void;
  onFailure?: (node: ISceneNodeInternal, error: Error) => void;
}): Promise<void> => {
  let nodeRequests: ISceneNodeInternal[] = [];
  const completedNodeRefs: Set<string> = new Set<string>();

  Object.keys(document.nodeMap).forEach((nodeRef) => {
    const node = document.nodeMap[nodeRef];
    const object3D = getObject3DBySceneNodeRef(nodeRef);

    if (isDynamicNode(node)) {
      return;
    }
    // prepare nodes
    if (!object3D) {
      onFailure?.(node, new Error('Object not found'));
    } else {
      // This copy allows us to change data complete including property deletes if necessary
      const tempNode: ISceneNodeInternal = {
        ...node,
        properties: {
          ...node.properties,
          [SceneNodeRuntimeProperty.LayerIds]: [RESERVED_LAYER_ID], //value doesn't matter here, just that's present and not empty
        },
      };
      nodeRequests.push(tempNode);
    }
  });

  while (nodeRequests.length > 0) {
    const remainingChildNodeRequests: ISceneNodeInternal[] = [];
    // do all root nodes or children with ready parents
    const createNodeEntityPromises: Promise<void>[] = [];
    nodeRequests.forEach((node) => {
      if (node.parentRef && !completedNodeRefs.has(node.parentRef!)) {
        remainingChildNodeRequests.push(node);
      } else {
        createNodeEntityPromises.push(
          createNodeEntity(node, node.parentRef ?? sceneRootEntityId)
            .then(() => {
              completedNodeRefs.add(node.ref);
              onSuccess?.(node);
            })
            .catch((error) => {
              onFailure?.(node, error);
            }),
        );
      }
    });
    //execute all possible requests
    await Promise.all(createNodeEntityPromises);
    //prepare for remaining requests
    nodeRequests = remainingChildNodeRequests;
  }
};
