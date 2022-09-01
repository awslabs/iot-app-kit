import { ITreeNode, TreeMap } from '../Model/TreeNode';

const removeNode = <T>(node: ITreeNode<T>, keyPropertyName: string, treeMap: TreeMap<T>) => {
  const key = (node as any)[keyPropertyName];

  if (node.getParent()) {
    const parentChildren = node.getParent()?.getChildren();
    const childIndex = parentChildren?.findIndex((child) => child === node);
    if (childIndex != null) {
      parentChildren?.splice(childIndex, 1);
    }
    node.setParentNode(undefined);
  }

  node.getChildren().forEach((child) => removeNode(child, keyPropertyName, treeMap));
  node.removeAllChildren();
  treeMap.delete(key);
};

export function cleanupTree<T>(keyPropertyName: string, treeMap: TreeMap<T>, staleNodeKeys: Set<string>) {
  staleNodeKeys.forEach((key) => {
    const node = treeMap.get(key);
    if (node) {
      removeNode(node, keyPropertyName, treeMap);
    }
  });
}
