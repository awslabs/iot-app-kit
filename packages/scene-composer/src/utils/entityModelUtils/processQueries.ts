import { Row } from '@aws-sdk/client-iottwinmaker';
import { DocumentType } from '@aws-sdk/types';

import { KnownComponentType } from '../../interfaces';
import { getGlobalSettings } from '../../common/GlobalSettings';
import {
  DEFAULT_ENTITY_BINDING_RELATIONSHIP_NAME,
  DEFAULT_PARENT_RELATIONSHIP_NAME,
  NODE_COMPONENT_TYPE_ID,
} from '../../common/entityModelConstants';
import { IEntityBindingComponentInternal, ISceneNodeInternal } from '../../store';
import { generateUUID } from '../mathUtils';

import { parseNode } from './nodeComponent';

export const isValidSceneNodeEntity = (entity: DocumentType): boolean => {
  return !!(entity && entity['entityId'] && entity['components'] && entity['components'].length > 0);
};

export const processQueries = async (
  queries: string[],
  postProcessNode?: (node: ISceneNodeInternal) => void,
): Promise<ISceneNodeInternal[]> => {
  const sceneMetadataModule = getGlobalSettings().twinMakerSceneMetadataModule;
  if (!sceneMetadataModule) {
    return [];
  }

  const requests = queries.map((q) => sceneMetadataModule.kgModule.executeQuery({ queryStatement: q }));
  const results = await Promise.all(requests);
  const rows: Row[] = [];
  results.forEach((r) => {
    if (r.rows) {
      rows.push(...r.rows);
    }
  });

  const sceneNodes: Record<string, ISceneNodeInternal> = {};

  rows.forEach((row) => {
    const entity = row.rowData?.at(0);
    if (!entity || !isValidSceneNodeEntity(entity)) {
      console.error('Invalid scene node entity from query');
      return;
    }

    const entityId = entity['entityId'];
    if (!sceneNodes[entityId]) {
      const nodeCompo = entity['components'].find((comp) => comp['componentTypeId'] === NODE_COMPONENT_TYPE_ID);

      const node = parseNode(entity, nodeCompo);
      if (!node) {
        return;
      }
      sceneNodes[entityId] = node;
    }

    // Handle relationships
    const relationship = row.rowData?.at(1);
    if (relationship && relationship['sourceEntityId'] == entityId) {
      if (relationship['relationshipName'] === DEFAULT_PARENT_RELATIONSHIP_NAME) {
        sceneNodes[entityId].parentRef = relationship['targetEntityId'];
      } else if (relationship['relationshipName'] === DEFAULT_ENTITY_BINDING_RELATIONSHIP_NAME) {
        const entityBinding: IEntityBindingComponentInternal = {
          ref: generateUUID(),
          type: KnownComponentType.EntityBinding,
          valueDataBinding: {
            dataBindingContext: {
              entityId: relationship['targetEntityId'],
            },
          },
        };

        sceneNodes[entityId].components!.push(entityBinding);
      }
    }
  });

  // Remove any nonexist parents and post process the nodes
  Object.values(sceneNodes).forEach((node) => {
    postProcessNode?.(node);
    if (node.parentRef && !sceneNodes[node.parentRef]) {
      node.parentRef = undefined;
    }
  });
  return Object.values(sceneNodes);
};
