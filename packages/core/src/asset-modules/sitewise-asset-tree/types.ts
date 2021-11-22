import { AssetSummary, DescribeAssetModelResponse, AssetPropertyValue } from '@aws-sdk/client-iotsitewise';
import { Subscription } from 'rxjs';

export type SiteWiseAssetTreeNode = {
  asset: AssetSummary,
  model?: DescribeAssetModelResponse,
  properties: Map<string, AssetPropertyValue>,
  hierarchies: Map<string, HierarchyGroup>,
};

export type HierarchyGroup = {
  id: string,
  name: string | undefined,
  isExpanded: boolean,
  children: SiteWiseAssetTreeNode[],
}

export type SiteWiseAssetTreeQuery = {
  rootAssetId: string | undefined
  withModels?: boolean,
  propertyIds?: string[]
}

export type AssetTreeSubscription = {
  subscription: Subscription,
  expand: (branchRef: BranchReference) => void,
  collapse: (branchRef: BranchReference) => void
}

export class BranchReference {
  public readonly assetId: string | undefined;
  public readonly hierarchyId: string;
  public readonly key: string;

  constructor(assetId: string | undefined, hierarchyId: string) {
    this.assetId = assetId;
    this.hierarchyId = hierarchyId;
    this.key = this.hierarchyId + (assetId || '');
  }
}
