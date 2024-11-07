import { type ExecuteQueryResponse } from '@aws-sdk/client-iottwinmaker';
import { type ElementDefinition } from 'cytoscape';
import type cytoscape from 'cytoscape';

type Component = {
  componentName: string;
  componentTypeId: string;
  properties: [];
};

const nodeShapes: { [key: string]: cytoscape.Css.NodeShape } = {
  'com.example.query.zone.lighting': 'round-tag',
  'com.example.query.construction.floor': 'hexagon',
  'com.example.query.construction.room': 'concave-hexagon',
};

const edgeStyles: { [key: string]: cytoscape.Css.LineStyle } = {
  feed: 'dashed',
};

export type Node = {
  entityId: string;
  entityName: string;
  components: Component[];
};

export type Edge = {
  sourceEntityId: string;
  targetEntityId: string;
  relationshipName: string;
};

export const mapResponseData = (res: ExecuteQueryResponse) => {
  return res.rows
    ?.map((r) => r.rowData)
    .reduce((acc, rowData) => {
      const newElements: ElementDefinition[] = res.columnDescriptions?.map(
        (col, i) => {
          const entity = !!rowData && rowData[i];

          if (entity) {
            if (col.type === 'EDGE') {
              const relationship = entity as Edge;
              return {
                data: {
                  source: relationship.sourceEntityId,
                  target: relationship.targetEntityId,
                  label: relationship.relationshipName,
                  lineStyle: edgeStyles[relationship.relationshipName],
                  ...relationship,
                },
              } as ElementDefinition;
            }

            const node = entity as Node;
            return {
              data: {
                id: node.entityId,
                label: node.entityName,
                shape: nodeShapes[node.components[0].componentTypeId],
                ...node,
              },
            } as ElementDefinition;
          }
        }
      ) as ElementDefinition[];

      return [...acc, ...newElements];
    }, [] as ElementDefinition[]) as ElementDefinition[];
};
