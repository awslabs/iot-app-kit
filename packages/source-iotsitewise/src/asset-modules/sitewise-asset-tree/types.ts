import {
  type LoadingStateEnum,
  type AssetSummaryQuery,
} from '../sitewise/types';
import type {
  AssetPropertyValue,
  AssetSummary,
  DescribeAssetModelResponse,
} from '@aws-sdk/client-iotsitewise';
import type { ErrorDetails, ProviderObserver } from '@iot-app-kit/core';

export type SiteWiseAssetTreeNode = {
  asset: AssetSummary;
  model?: DescribeAssetModelResponse;
  properties: Map<string, AssetPropertyValue>;
  hierarchies: Map<string, HierarchyGroup>;
};

export type HierarchyGroup = {
  id: string;
  name: string | undefined;
  isExpanded: boolean;
  loadingState: LoadingStateEnum;
  children: SiteWiseAssetTreeNode[];
};

export type SiteWiseAssetTreeQueryArguments = {
  withModels?: boolean;
  withPropertyValues?: string[];
};

export type RootedSiteWiseAssetTreeQueryArguments =
  SiteWiseAssetTreeQueryArguments & {
    asset: AssetSummaryQuery;
  };

export type AssetTreeQuery = SiteWiseAssetTreeQueryArguments & {
  asset?: AssetSummaryQuery;
};

export interface SiteWiseAssetTreeObserver
  extends ProviderObserver<SiteWiseAssetTreeNode[]> {
  next: (tree: SiteWiseAssetTreeNode[]) => void;
  error?: (err: ErrorDetails[]) => void;
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
