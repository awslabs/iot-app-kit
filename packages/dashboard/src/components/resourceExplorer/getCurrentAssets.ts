import { BranchReference } from '@iot-app-kit/source-iotsitewise';
import { AssetSummary, AssetHierarchy } from '@aws-sdk/client-iotsitewise';
import { HIERARCHY_ROOT_ID } from './nextResourceExplorer';
import { AssetNode, BranchReferenceWithAssetIds, MaybeSiteWiseAssetTreeSessionInterface } from './types';
import { ExtendedPanelAssetSummary, EitherAssetSummary } from './nextResourceExplorer';
import { DashboardMessages } from '~/messages';

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

export const getCurrentAssets = async (
  provider: MaybeSiteWiseAssetTreeSessionInterface,
  currentBranchId: string,
  messageOverrides: DashboardMessages
) => {
  const rootAssetsHeaderItem: ExtendedPanelAssetSummary = {
    isHeader: true,
    name: messageOverrides.resourceExplorer.rootAssetsHeader,
  };

  const assetsHeaderItem: ExtendedPanelAssetSummary = {
    isHeader: true,
    name: messageOverrides.resourceExplorer.childAssetsHeader,
  };

  const branches = provider?.branches;
  const assetNodes = provider?.assetNodes;

  // If no data, return empty items.
  if (!branches || !assetNodes) return [];

  // If we are at the dashboard root, return all assets below the root
  if (currentBranchId === HIERARCHY_ROOT_ID) {
    if (!branches[HIERARCHY_ROOT_ID]) return [];
    const rootAssets = branches[HIERARCHY_ROOT_ID].assetIds.map(
      (id: string) => assetNodes[id].asset
    ) as ExtendedPanelAssetSummary[];

    // Add header and return.
    rootAssets.unshift(rootAssetsHeaderItem);
    return rootAssets;
  }

  // If not at the dashboard root, return all assets below the current branch
  const currentAsset = assetNodes[currentBranchId]?.asset;
  if (!currentAsset) return [];

  // Otherwise, get all assets under this asset's hierarchy
  const allHierarchyAssets: EitherAssetSummary[] = getAllHierachyAssets(currentAsset, branches, assetNodes);

  // Add header and return.
  allHierarchyAssets.unshift(assetsHeaderItem);
  return allHierarchyAssets;
};
