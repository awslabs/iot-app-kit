import { type ITreeNode } from '../Model/TreeNode';

const recursiveFlatTree = <T>(
  tree: ITreeNode<T>[],
  flattenTree: ITreeNode<T>[]
) => {
  tree.forEach((node) => {
    flattenTree.push(node);
    if (node.getChildren().length) {
      recursiveFlatTree(node.getChildren(), flattenTree);
    }
  });
};

export const flatTree = <T>(tree: ITreeNode<T>[]) => {
  const flattenTree: ITreeNode<T>[] = [];
  recursiveFlatTree(tree, flattenTree);
  return flattenTree;
};
