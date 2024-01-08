import {
  INodeResults,
  IRelationResults,
} from './interfaces/kgDataSourceInterfaces';
import { ExecuteQueryCommandOutput } from '@aws-sdk/client-iottwinmaker';
import { NodeData, EdgeData } from './graph/types';

function parseNode(item: INodeResults, nodeData: Map<string, NodeData>) {
  const entityId = item.entityId;
  const entityName = item.entityName;
  const entityData: INodeResults = { ...item };
  nodeData.set(entityId, {
    entityData,
    id: entityId,
    label: entityName ? entityName : '',
  });
}
function parseEdge(item: IRelationResults, edgeData: Map<string, EdgeData>) {
  const sourceId = item.sourceEntityId;
  const targetId = item.targetEntityId;
  const relationshipName = item.relationshipName;
  const id = `${sourceId}-${targetId}`;
  edgeData.set(id, {
    id,
    label: relationshipName ? relationshipName : '',
    source: sourceId,
    target: targetId,
  });
}

export class ResponseParser {
  static parse(
    queryRows: ExecuteQueryCommandOutput['rows'] | null | undefined,
    queryColumnDescriptions:
      | ExecuteQueryCommandOutput['columnDescriptions']
      | null
      | undefined
  ) {
    const nodeData = new Map<string, NodeData>();
    const edgeData = new Map<string, EdgeData>();
    if (queryRows && queryColumnDescriptions) {
      for (const row of queryRows) {
        for (
          let columnNumber = 0;
          columnNumber < queryColumnDescriptions.length;
          columnNumber++
        ) {
          const itemType = queryColumnDescriptions[columnNumber].type;
          const rowData = row.rowData;
          const item = rowData![columnNumber];
          switch (itemType) {
            case 'NODE':
              parseNode(item as unknown as INodeResults, nodeData);
              break;
            case 'EDGE':
              parseEdge(item as unknown as IRelationResults, edgeData);
              break;
            case 'VALUE':
              // Intentional do nothing
              break;
            default:
              //Do nothing for now till we provide error handling.
              break;
          }
        }
      }
    }
    return { nodeData, edgeData };
  }
}
