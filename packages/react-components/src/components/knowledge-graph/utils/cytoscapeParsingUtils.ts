import { ElementDefinition, NodeDefinition, EdgeDefinition } from 'cytoscape';
import { NodeData, EdgeData } from '../graph/types';

export function getElementsDefinition(
  nodeData: NodeData[],
  edgeData?: EdgeData[]
): ElementDefinition[] {
  const elements: ElementDefinition[] = [
    ...nodeData.map<NodeDefinition>((data) => ({
      data: { ...data },
    })),
  ];
  if (edgeData) {
    elements.push(
      ...edgeData.map<EdgeDefinition>((data) => ({
        data: { ...data },
      }))
    );
  }
  return elements;
}
