import { ITreeNode, TreeMap } from '../Model/TreeNode';

export function expandOrCollapseChildren<T>(
  node: ITreeNode<T>,
  treeMap: TreeMap<T>,
  keyPropertyName: string
) {
  node.getChildren().forEach((child: ITreeNode<T>) => {
    const key = (child as any)[keyPropertyName];
    child.setVisible(node.isExpanded() && node.isVisible());
    treeMap.set(key, child);
    expandOrCollapseChildren(child, treeMap, keyPropertyName);
  });
}
