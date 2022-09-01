import { ExpandableTableNodeStatus, ITreeNode, TreeMap, TreeNode } from '../Model/TreeNode';
import { cleanupTree } from './cleanup';

const createOrSetParentNode = <T>(
  node: ITreeNode<T>,
  treeMap: TreeMap<T>,
  keyPropertyName: string,
  parentKeyPropertyName: string
) => {
  const parentKey = (node as any)[parentKeyPropertyName];
  if (parentKey) {
    const parentNode = treeMap.get(parentKey) || new TreeNode({ [keyPropertyName]: parentKey } as T);
    if (parentNode.getChildren().length === 0 || node.getParent() !== parentNode) {
      node.setParentNode(parentNode);
      parentNode.addChild(node);
    }
    treeMap.set(parentKey, parentNode);
  }
};

const updateNode = <T>(node: ITreeNode<T>, newData: T) => {
  Object.keys(newData).forEach((prop) => {
    // eslint-disable-next-line no-param-reassign
    (node as any)[prop] = (newData as any)[prop];
  });
};

const createNode = <T>(
  item: T,
  treeMap: TreeMap<T>,
  keyPropertyName: string,
  parentKeyPropertyName: string
): ITreeNode<T> => {
  const key = (item as any)[keyPropertyName];
  let node = treeMap.get(key);
  if (node) {
    // in case exists just updates
    updateNode(node, item);
  } else {
    node = new TreeNode(item);
  }

  createOrSetParentNode(node, treeMap, keyPropertyName, parentKeyPropertyName);
  treeMap.set(key, node);
  return node;
};

const prepareNode = <T>(node: ITreeNode<T>, treeMap: TreeMap<T>, keyPropertyName: string): ITreeNode<T> => {
  const key = (node as any)[keyPropertyName];
  const parent = node.getParent();
  const isVisible = parent ? parent.isExpanded() && parent.isVisible() : true;
  node.setVisible(isVisible);
  node.setStatus(
    node.hasChildren || node.getChildren().length > 0
      ? ExpandableTableNodeStatus.normal
      : ExpandableTableNodeStatus.emptyChildren
  );
  treeMap.set(key, node);
  return node;
};

export const buildTreeNodes = <T>(
  items: T[],
  treeMap: TreeMap<T>,
  keyPropertyName: string,
  parentKeyPropertyName: string
): ITreeNode<T>[] => {
  const staleNodeKeys = new Set<string>(Array.from(treeMap.keys()));
  const treeNodes = items
    .map((item) => {
      const key = (item as any)[keyPropertyName];
      staleNodeKeys.delete(key);
      return createNode(item, treeMap, keyPropertyName, parentKeyPropertyName);
    })
    .map((node) => prepareNode(node, treeMap, keyPropertyName))
    .filter((node) => typeof node.getParent() === 'undefined');

  cleanupTree(keyPropertyName, treeMap, staleNodeKeys);
  return treeNodes;
};

export const recursiveBuildTreePrefix = <T>(node: ITreeNode<T>, index: number, parentLastChildPath: boolean[]) => {
  const parent = node.getParent();
  const isLastChild = parent ? parent.getChildren().length - 1 === index : true;
  node.buildPrefix(isLastChild, parentLastChildPath);
  node
    .getChildren()
    .forEach((child: ITreeNode<T>, childIndex) =>
      recursiveBuildTreePrefix(child, childIndex, parentLastChildPath.concat([isLastChild]))
    );
  return node;
};

export const buildTreePrefix = <T>(tree: ITreeNode<T>[]) => {
  return tree.map((node, index) => {
    return recursiveBuildTreePrefix(node, index, []);
  });
};
