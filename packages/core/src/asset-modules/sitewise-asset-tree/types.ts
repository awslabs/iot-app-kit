import { AssetPropertyValue, AssetSummary, DescribeAssetModelResponse } from '@aws-sdk/client-iotsitewise';
import { AssetSummaryQuery, LoadingStateEnum } from '../sitewise/types';
import { ErrorDetails } from '../../common/types';

import {
  IoTAppKitComponentSession,
  Provider,
  ProviderObserver,
  datamodule,
  SiteWiseAssetTreeSession,
  Query,
  SiteWiseAssetSession,
} from '../../index';

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
  withPropertyValues?: [string];
};

export type RootedSiteWiseAssetTreeQueryArguments = SiteWiseAssetTreeQueryArguments & {
  asset: AssetSummaryQuery;
};

export class SiteWiseAssetTreeQuery implements Query<SiteWiseAssetTreeProvider> {
  readonly rootAssetId: string | undefined;
  readonly withModels: boolean;
  readonly propertyIds: string[];

  constructor(args?: { asset?: AssetSummaryQuery; withModels?: boolean; withPropertyValues?: string[] }) {
    this.rootAssetId = args?.asset?.assetId;
    this.withModels = args?.withModels || false;
    this.propertyIds = args?.withPropertyValues || [];
  }

  build(session: IoTAppKitComponentSession, params?: void): SiteWiseAssetTreeProvider {
    const assetSession: SiteWiseAssetSession = datamodule.iotsitewise.assetDataSession(session);
    return new SiteWiseAssetTreeSession(assetSession, this);
  }
}

export const isSiteWiseAssetTreeQuery = (query: SiteWiseAssetTreeQuery | any): query is SiteWiseAssetTreeQuery => {
  const asSiteWiseQuery: SiteWiseAssetTreeQuery = query as SiteWiseAssetTreeQuery;
  return (
    asSiteWiseQuery.hasOwnProperty('rootAssetId') &&
    asSiteWiseQuery.hasOwnProperty('withModels') &&
    asSiteWiseQuery.hasOwnProperty('propertyIds')
  );
};

export interface SiteWiseAssetTreeObserver extends ProviderObserver<SiteWiseAssetTreeNode[]> {
  next: (tree: SiteWiseAssetTreeNode[]) => void;
  error?: (err: ErrorDetails[]) => void;
}

export interface SiteWiseAssetTreeProvider extends Provider<SiteWiseAssetTreeNode[]> {
  expand(branchRef: BranchReference): void;
  collapse(branchRef: BranchReference): void;
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
