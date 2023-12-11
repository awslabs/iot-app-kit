import { Subscription } from 'rxjs';
import type {
  AssetPropertyValue,
  AssetSummary,
  DescribeAssetCommandInput,
  DescribeAssetCommandOutput,
  DescribeAssetModelCommandInput,
  DescribeAssetModelCommandOutput,
  DescribeAssetModelResponse,
  GetAssetPropertyValueCommandInput,
  GetAssetPropertyValueCommandOutput,
  ListAssetsCommandInput,
  ListAssetsCommandOutput,
  ListAssociatedAssetsCommandInput,
  ListAssociatedAssetsCommandOutput,
} from '@aws-sdk/client-iotsitewise';
import type { ErrorDetails } from '@iot-app-kit/core';
import type { ModeledDataStream } from '../describeModeledDataStreamRequest';

export type SiteWiseAssetDataSource = {
  describeAsset: (input: DescribeAssetCommandInput) => Promise<DescribeAssetCommandOutput>;
  getPropertyValue: (input: GetAssetPropertyValueCommandInput) => Promise<GetAssetPropertyValueCommandOutput>;
  describeAssetModel: (input: DescribeAssetModelCommandInput) => Promise<DescribeAssetModelCommandOutput>;
  listAssets: (input: ListAssetsCommandInput) => Promise<ListAssetsCommandOutput>;
  listAssociatedAssets: (input: ListAssociatedAssetsCommandInput) => Promise<ListAssociatedAssetsCommandOutput>;
  describeModeledDataStream: (input: {
    assetPropertyId: string;
    assetId: string;
    assetModelId: string;
  }) => Promise<ModeledDataStream | undefined | never>;
};

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
  requestAssetSummary(
    query: AssetSummaryQuery,
    observer: {
      next: (assetSummary: AssetSummary) => void;
      error?: (err: ErrorDetails[]) => void;
    }
  ): Subscription;

  fetchAssetModel(query: AssetModelQuery): Promise<DescribeAssetModelResponse>;
  requestAssetModel(
    query: AssetModelQuery,
    observer: {
      next: (assetSummary: DescribeAssetModelResponse) => void;
      error?: (err: ErrorDetails[]) => void;
    }
  ): Subscription;

  fetchAssetPropertyValue(query: AssetPropertyValueQuery): Promise<AssetPropertyValue>;
  requestAssetPropertyValue(
    query: AssetPropertyValueQuery,
    observer: {
      next: (assetSummary: AssetPropertyValue) => void;
      error?: (err: ErrorDetails[]) => void;
    }
  ): Subscription;

  fetchAssetHierarchy(query: AssetHierarchyQuery): Promise<HierarchyAssetSummaryList>;
  requestAssetHierarchy(
    query: AssetHierarchyQuery,
    observer: {
      next: (assetSummary: HierarchyAssetSummaryList) => void;
      error?: (err: ErrorDetails[]) => void;
    }
  ): Subscription;

  fetchRootAssets(): Promise<HierarchyAssetSummaryList>;
  requestRootAssets(observer: {
    next: (assetSummary: HierarchyAssetSummaryList) => void;
    error?: (err: ErrorDetails[]) => void;
  }): Subscription;

  close(): void;
}
