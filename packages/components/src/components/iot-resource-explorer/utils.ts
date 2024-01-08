import {
  SiteWiseAssetTreeNode,
  HierarchyGroup,
} from '@iot-app-kit/source-iotsitewise';
import { SiteWiseAssetResource } from './types';

const recursiveParseSitewiseAssetTree = (
  flattenTree: SiteWiseAssetResource[],
  subTree: SiteWiseAssetTreeNode[],
  parentId?: string
) => {
  subTree.forEach((node) => {
    flattenTree.push({
      ...node.asset,
      hasChildren: node.hierarchies.size > 0,
      parentId,
    });
    node.hierarchies.forEach((hierarchy: HierarchyGroup) => {
      recursiveParseSitewiseAssetTree(
        flattenTree,
        hierarchy.children,
        node.asset.id
      );
    });
  });
};

export const parseSitewiseAssetTree = (tree: SiteWiseAssetTreeNode[]) => {
  const flattenTree: SiteWiseAssetResource[] = [];
  recursiveParseSitewiseAssetTree(flattenTree, tree);
  return flattenTree;
};
