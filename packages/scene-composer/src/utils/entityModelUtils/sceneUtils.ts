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
  DEFAULT_PARENT_RELATIONSHIP_NAME,
  SCENE_ROOT_ENTITY_COMPONENT_NAME,
  SCENE_ROOT_ENTITY_ID,
  SCENE_ROOT_ENTITY_NAME,
  RESERVED_LAYER_ID,
} from '../../common/entityModelConstants';
import { getGlobalSettings } from '../../common/GlobalSettings';
import { generateUUID } from '../mathUtils';
import { ISceneDocumentInternal, ISceneNodeInternal } from '../../store';
import { ISceneDocument, KnownSceneProperty } from '../../interfaces';
import { SceneNodeRuntimeProperty } from '../../store/internalInterfaces';

import { createNodeEntity } from './createNodeEntity';
import { processQueries } from './processQueries';
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
    components: undefined,
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

export const useSceneRootEntityId = (document?: ISceneDocumentInternal): string => {
  const sceneRootEntityId = document?.properties?.[KnownSceneProperty.SceneRootEntityId];
  return sceneRootEntityId;
};

export const saveSceneNodes = async (
  nodeRequests: ISceneNodeInternal[],
  sceneRootEntityId: string,
  onSuccess?: (node: ISceneNodeInternal) => void,
  onFailure?: (node: ISceneNodeInternal, error: Error) => void,
): Promise<void> => {
  const completedNodeRefs: Set<string> = new Set<string>();

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
  const nodeRequests: ISceneNodeInternal[] = [];

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

  await saveSceneNodes(nodeRequests, sceneRootEntityId, onSuccess, onFailure);
};

export const fetchSceneNodes = async (sceneRootEntityId: string): Promise<ISceneNodeInternal[]> => {
  const nodes = await processQueries([
    // Get node entities under the sceneRootEntityId
    `select entity, r, e
      from EntityGraph
      match (entity)-[r]->(e)
      where r.relationshipName = '${DEFAULT_PARENT_RELATIONSHIP_NAME}'
      and e.entityId = '${sceneRootEntityId}'`,

    `select c, r1, entity
      from EntityGraph
      match (c)-[r1]->(entity)-[r]->(e)
      where r.relationshipName = '${DEFAULT_PARENT_RELATIONSHIP_NAME}'
      and e.entityId = '${sceneRootEntityId}'`,

    `select c2, r2, c
      from EntityGraph
      match (c2)-[r2]->(c)-[r1]->(entity)-[r]->(e)
      where r.relationshipName = '${DEFAULT_PARENT_RELATIONSHIP_NAME}'
      and e.entityId = '${sceneRootEntityId}'`,

    `select c3, r3, c2
      from EntityGraph
      match (c3)-[r3]->(c2)-[r2]->(c)-[r1]->(entity)-[r]->(e)
      where r.relationshipName = '${DEFAULT_PARENT_RELATIONSHIP_NAME}'
      and e.entityId = '${sceneRootEntityId}'`,

    `select c4, r4, c3
      from EntityGraph
      match (c4)-[r4]->(c3)-[r3]->(c2)-[r2]->(c)-[r1]->(entity)-[r]->(e)
      where r.relationshipName = '${DEFAULT_PARENT_RELATIONSHIP_NAME}'
      and e.entityId = '${sceneRootEntityId}'`,

    `select c5, r5, c4
      from EntityGraph
      match (c5)-[r5]->(c4)-[r4]->(c3)-[r3]->(c2)-[r2]->(c)-[r1]->(entity)-[r]->(e)
      where r.relationshipName = '${DEFAULT_PARENT_RELATIONSHIP_NAME}'
      and e.entityId = '${sceneRootEntityId}'`,

    `select c6, r6, c5
      from EntityGraph
      match (c6)-[r6]->(c5)-[r5]->(c4)-[r4]->(c3)-[r3]->(c2)-[r2]->(c)-[r1]->(entity)-[r]->(e)
      where r.relationshipName = '${DEFAULT_PARENT_RELATIONSHIP_NAME}'
      and e.entityId = '${sceneRootEntityId}'`,

    `select c7, r7, c6
      from EntityGraph
      match (c7)-[r7]->(c6)-[r6]->(c5)-[r5]->(c4)-[r4]->(c3)-[r3]->(c2)-[r2]->(c)-[r1]->(entity)-[r]->(e)
      where r.relationshipName = '${DEFAULT_PARENT_RELATIONSHIP_NAME}'
      and e.entityId = '${sceneRootEntityId}'`,

    `select c8, r8, c7
      from EntityGraph
      match (c8)-[r8]->(c7)-[r7]->(c6)-[r6]->(c5)-[r5]->(c4)-[r4]->(c3)-[r3]->(c2)-[r2]->(c)-[r1]->(entity)-[r]->(e)
      where r.relationshipName = '${DEFAULT_PARENT_RELATIONSHIP_NAME}'
      and e.entityId = '${sceneRootEntityId}'`,

    `select c9, r9, c8
      from EntityGraph
      match (c9)-[r9]->(c8)-[r8]->(c7)-[r7]->(c6)-[r6]->(c5)-[r5]->(c4)-[r4]->(c3)-[r3]->(c2)-[r2]->(c)-[r1]->(entity)-[r]->(e)
      where r.relationshipName = '${DEFAULT_PARENT_RELATIONSHIP_NAME}'
      and e.entityId = '${sceneRootEntityId}'`,
  ]);

  return nodes;
};

export const cloneSceneNodes = async (nodes: ISceneNodeInternal[]): Promise<ISceneNodeInternal[]> => {
  const map = {};
  nodes.forEach((node) => {
    map[node.ref] = generateUUID();
  });

  return nodes.map((node) => {
    return {
      ...node,
      ref: map[node.ref],
      parentRef: node.parentRef ? map[node.parentRef] : undefined,
      properties: {
        ...node.properties,
        [SceneNodeRuntimeProperty.LayerIds]: [],
      },
    };
  });
};
