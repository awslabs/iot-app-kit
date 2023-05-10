import type { NodeData } from '../../src/components/graph/types';

const Mixer: NodeData = {
  id: '123',
  name: 'Mixer',
  entityData: {
    entityId: 'entityId',
    entityName: 'entityName',
  },
  state: 'ok',
  shape: 'hexagon',
  parent: undefined,
  position: {
    x: 0,
    y: 0,
  },
};

export const mockNodeData: Map<string, NodeData> = new Map<string, NodeData>([['Mixer', Mixer]]);
