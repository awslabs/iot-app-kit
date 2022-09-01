import { ITreeNode, TreeMap } from '../Model/TreeNode';
import { buildTreeNodes, buildTreePrefix, filteringFunction, flatTree, sortTree } from './index';

const items = [
  {
    id: 'ae65323e-6778-420b-ac1a-eff7a8950300',
    name: 'Great Grand Parent',
    priority: 0,
  },
  {
    parentId: 'ae65323e-6778-420b-ac1a-eff7a8950300',
    id: '7e38bf23-a2e1-4fa7-8ba8-1232313213',
    name: 'Grand Parent',
    priority: 1,
  },
  {
    parentId: '7e38bf23-a2e1-4fa7-8ba8-1232313213',
    id: '7e38bf23-a2e1-4fa7-8ba8-111111',
    name: 'Parent',
    priority: 2,
  },
  {
    parentId: '7e38bf23-a2e1-4fa7-8ba8-111111',
    id: '41043ebf-9912-412c-b4f9-5114e3',
    name: 'Child',
  },
  {
    parentId: '41043ebf-9912-412c-b4f9-5114e3',
    id: '41043ebf-9912-412c-b4f9-511tre',
    name: 'Grand Child',
    priority: 3,
  },
  {
    parentId: '41043ebf-9912-412c-b4f9-511tre',
    id: '51043ebf-9912-412c-b4f9-511tre',
    name: 'Great Grand Child',
    priority: 4,
  },
];

const columnsDefinitions = [
  {
    id: 'name',
    header: 'Name',
    cell: (e: any) => e.name,
    sortingField: 'name',
  },
  {
    id: 'priority',
    header: 'priority',
    cell: (e: any) => e.priority,
    sortingField: 'priority',
  },
];

describe('TreeUtility', () => {
  let nodes: ITreeNode<any>[] = [];

  beforeEach(() => {
    const newNodes = buildTreeNodes(items, new Map() as TreeMap<any>, 'id', 'parentId');
    sortTree(newNodes, {} as any, []);
    nodes = flatTree(buildTreePrefix(newNodes));
  });

  it('create nodes', () => {
    expect(nodes.length).toEqual(6);
  });

  it('update nodes', () => {
    const treeMap = new Map();
    nodes.forEach((node) => treeMap.set(node.id, node));

    const newItems = [...items];
    const parentIndex = newItems.findIndex((item) => item.name === 'Parent');
    const newParentItem = {
      ...items[parentIndex],
      priority: 99,
    };
    newItems.splice(parentIndex, 1, newParentItem);

    const newNodes = flatTree(buildTreeNodes(newItems, treeMap, 'id', 'parentId'));
    const parentNode = newNodes.find((item) => item.name === 'Parent');
    expect(parentNode).toBeDefined();
    expect(parentNode?.priority).toBe(newParentItem.priority);
  });

  it('delete nodes', () => {
    const treeMap = new Map();
    nodes.forEach((node) => treeMap.set(node.id, node));

    const newItems = [...items];
    const parentIndex = newItems.findIndex((item) => item.name === 'Parent');
    newItems.splice(parentIndex, 1);

    const newNodes = flatTree(buildTreeNodes(newItems, treeMap, 'id', 'parentId'));
    expect(newNodes.length).toEqual(2);
    expect(treeMap.size).toEqual(2);
  });

  it('filtering function by name', () => {
    const nodesFiltered = nodes.filter((node) => filteringFunction(node, 'Great Grand Child', ['name']));
    expect(nodesFiltered.length).toEqual(6);
  });

  it('filtering function by all columns', () => {
    const nodesFiltered = nodes.filter((node) => filteringFunction(node, 'Great Grand Child'));
    expect(nodesFiltered.length).toEqual(6);
  });

  it('custom filtering function by name', () => {
    const customFilteringFunction = (item: any, filteringText: string) => item.name === filteringText;
    const nodesFiltered = nodes.filter((node) =>
      filteringFunction(node, 'Great Grand Child', undefined, customFilteringFunction)
    );
    expect(nodesFiltered.length).toEqual(6);
  });

  it('sort by name and priority', () => {
    const tree = buildTreeNodes(items, new Map() as TreeMap<any>, 'id', 'parentId');
    const sortedNodes = flatTree(tree);
    sortTree(
      sortedNodes,
      {
        sortingColumn: {
          sortingField: 'name',
        },
      },
      columnsDefinitions
    );
    expect(sortedNodes.length).toEqual(6);
    expect(sortedNodes[0].name).toEqual('Child');
    expect(sortedNodes[5].name).toEqual('Parent');

    sortTree(
      sortedNodes,
      {
        sortingColumn: {
          sortingField: 'priority',
        },
      },
      columnsDefinitions
    );
    expect(sortedNodes[0].name).toEqual('Child');
    expect(sortedNodes[5].name).toEqual('Great Grand Child');
  });

  it('sort reverse by priority', () => {
    const tree = buildTreeNodes(items, new Map() as TreeMap<any>, 'id', 'parentId');
    const sortedNodes = flatTree(tree);
    sortTree(
      sortedNodes,
      {
        isDescending: true,
        sortingColumn: {
          sortingField: 'priority',
        },
      },
      columnsDefinitions
    );
    expect(sortedNodes.length).toEqual(6);
    expect(sortedNodes[0].name).toEqual('Great Grand Child');
    expect(sortedNodes[5].name).toEqual('Child');
  });
});
