import { SiteWiseAssetTreeNode } from '@iot-app-kit/core';
import { ResourceExplorerQuery, SitewiseAssetResource } from './types';

const recursiveParseSitewiseAssetTree = (
  flattenTree: SitewiseAssetResource[],
  subTree: SiteWiseAssetTreeNode[],
  parentId?: string
) => {
  subTree.forEach((node) => {
    flattenTree.push({
      ...node.asset,
      hasChildren: node.hierarchies.size > 0,
      parentId,
    });
    Array.from(node.hierarchies.values()).forEach((hierarchy) => {
      recursiveParseSitewiseAssetTree(flattenTree, hierarchy.children, node.asset.id);
    });
  });
};

export const parseSitewiseAssetTree = (tree: SiteWiseAssetTreeNode[]) => {
  const flattenTree: SitewiseAssetResource[] = [];
  recursiveParseSitewiseAssetTree(flattenTree, tree);
  return flattenTree;
};

export const isSiteWiseQuery = (query: ResourceExplorerQuery) => {
  return query?.source === 'site-wise';
};
