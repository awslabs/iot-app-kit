import { BranchReference } from '@iot-app-kit/source-iotsitewise';
import { AssetSummary, AssetHierarchy } from '@aws-sdk/client-iotsitewise';
import { HIERARCHY_ROOT_ID } from '.';
import { AssetNode, BranchReferenceWithAssetIds, MaybeSiteWiseAssetTreeSessionInterface } from './types';

const getAllHierachyAssets = (
  currentAsset: AssetSummary,
  branches: Record<string, BranchReferenceWithAssetIds>,
  assetNodes: Record<string, AssetNode>
) => {
  const result: AssetSummary[] | [] = [];
  if (!currentAsset?.hierarchies) return result;

  currentAsset?.hierarchies?.forEach((hierarchy: AssetHierarchy) => {
    const branchRef = new BranchReference(currentAsset.id, hierarchy.id as string);
    const branchRefKey = branchRef?.key;
    if (!branchRefKey) return result;

    const branchKeyRef = branches[branchRefKey];
    if (!branchKeyRef) return result;

    const branchAssetIds = branchKeyRef?.assetIds;
    if (!branchAssetIds) return result;

    branchAssetIds.forEach((id: string) => {
      if (!assetNodes[id]?.asset) return;
      result.push(assetNodes[id].asset as never);
    });
  });

  return result || [];
};

export const getCurrentItems = (provider: MaybeSiteWiseAssetTreeSessionInterface, currentBranchId: string) => {
  const branches = provider?.branches;
  const assetNodes = provider?.assetNodes;

  if (!branches || !assetNodes) return [];

  if (currentBranchId === HIERARCHY_ROOT_ID) {
    if (!branches[HIERARCHY_ROOT_ID]) return [];
    const rootAssets = branches[HIERARCHY_ROOT_ID].assetIds.map((id: string) => assetNodes[id].asset);
    return rootAssets;
  }

  const currentAsset = assetNodes[currentBranchId]?.asset;
  if (!currentAsset) return [];

  const currentItems = getAllHierachyAssets(currentAsset, branches, assetNodes);

  return currentItems;
};
