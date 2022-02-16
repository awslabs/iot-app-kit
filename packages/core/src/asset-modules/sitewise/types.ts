/**
 * These are the types of high level queries that you can make to the SiteWise asset module
 */
import { AssetPropertyValue, AssetSummary, DescribeAssetModelResponse } from '@aws-sdk/client-iotsitewise';
import { Subscription } from 'rxjs';

export type AssetSummaryQuery = {
  assetId: string;
};

export type AssetModelQuery = {
  assetModelId: string;
};

export type AssetPropertyValueQuery = {
  assetId: string;
  propertyId: string;
};

export type AssetHierarchyQuery = {
  assetId?: string;
  assetHierarchyId: string;
};

export function assetHierarchyQueryKey(query: AssetHierarchyQuery): string {
  return (query.assetId ? query.assetId + ':' : '') + query.assetHierarchyId;
}

export enum LoadingStateEnum {
  NOT_LOADED,
  LOADING,
  PAUSED,
  LOADED,
}

export const HIERARCHY_ROOT_ID = 'HIERARCHY_ROOT_ID';

export type CachedAssetSummaryBlock = {
  assetIds: string[];
  loadingStage: LoadingStateEnum;
  paginationToken: string | undefined;
};

export type HierarchyAssetSummaryList = {
  assetHierarchyId: string;
  assets: AssetSummary[];
  loadingState: LoadingStateEnum;
};

export interface SiteWiseAssetModuleInterface {
  startSession(): SiteWiseAssetSessionInterface;
}

export interface SiteWiseAssetSessionInterface {
  fetchAssetSummary(query: AssetSummaryQuery): Promise<AssetSummary>;
  requestAssetSummary(query: AssetSummaryQuery, observer: (assetSummary: AssetSummary) => void): Subscription;

  fetchAssetModel(query: AssetModelQuery): Promise<DescribeAssetModelResponse>;
  requestAssetModel(query: AssetModelQuery, observer: (assetSummary: DescribeAssetModelResponse) => void): Subscription;

  fetchAssetPropertyValue(query: AssetPropertyValueQuery): Promise<AssetPropertyValue>;
  requestAssetPropertyValue(
    query: AssetPropertyValueQuery,
    observer: (assetSummary: AssetPropertyValue) => void
  ): Subscription;

  fetchAssetHierarchy(query: AssetHierarchyQuery): Promise<HierarchyAssetSummaryList>;
  requestAssetHierarchy(
    query: AssetHierarchyQuery,
    observer: (assetSummary: HierarchyAssetSummaryList) => void
  ): Subscription;

  fetchRootAssets(): Promise<HierarchyAssetSummaryList>;
  requestRootAssets(observer: (assetSummary: HierarchyAssetSummaryList) => void): Subscription;

  close(): void;
}
