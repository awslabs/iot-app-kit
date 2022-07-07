import {
  addComponentToComponentNodeMap,
  addNodeToComponentNodeMap,
  deleteComponentFromComponentNodeMap,
  deleteNodeFromComponentNodeMap,
} from '../../../src/store/helpers/componentMapHelpers';

describe('componentMapHelpers', () => {
  const mockNode = {
    ref: 'mock-node',
    components: [
      { ref: 'comp-1', type: 'abc' },
      { ref: 'comp-2', type: 'def' },
    ],
  } as any;
  let mockComponentNodeMap;

  beforeEach(() => {
    mockComponentNodeMap = {
      abc: { 'mock-node': ['comp-1'] },
      def: { 'mock-node': ['comp-2'] },
    };
  });

  it('should delete all component from map correctly', () => {
    deleteNodeFromComponentNodeMap(mockComponentNodeMap, mockNode);

    expect(mockComponentNodeMap).toEqual({ abc: {}, def: {} });
  });

  it('should delete component from map correctly', () => {
    deleteComponentFromComponentNodeMap(mockComponentNodeMap.abc, mockNode.ref, 'comp-1');

    expect(mockComponentNodeMap).toEqual({ abc: {}, def: { 'mock-node': ['comp-2'] } });
  });

  it('should add all component to map correctly', () => {
    const map = {};
    addNodeToComponentNodeMap(map, mockNode);

    expect(map).toEqual(mockComponentNodeMap);
  });

  it('should add component to map correctly', () => {
    const map = {};
    addComponentToComponentNodeMap(map, mockNode.ref, 'comp-1');

    expect(map).toEqual(mockComponentNodeMap.abc);
  });
});
