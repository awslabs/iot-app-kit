/**
 * These are the types of high level queries that you can make to the SiteWise asset module
 */
import { AssetSummary } from '@aws-sdk/client-iotsitewise';

export type AssetQuery = {};

export type AssetSummaryQuery = AssetQuery & {
  assetId: string;
};
export const isAssetSummaryQuery = (query: AssetQuery): query is AssetSummaryQuery =>
  (query as AssetSummaryQuery).assetId != undefined && !(query as AssetPropertyValueQuery).propertyId;

export type AssetModelQuery = AssetQuery & {
  assetModelId: string;
};
export const isAssetModelQuery = (query: AssetQuery): query is AssetModelQuery =>
  (query as AssetModelQuery).assetModelId != undefined;

export type AssetPropertyValueQuery = AssetQuery & {
  assetId: string;
  propertyId: string;
};
export const isAssetPropertyValueQuery = (query: AssetQuery): query is AssetPropertyValueQuery =>
  (query as AssetPropertyValueQuery).propertyId != undefined && (query as AssetPropertyValueQuery).assetId != undefined;

export type AssetHierarchyQuery = AssetQuery & {
  assetId?: string;
  assetHierarchyId: string;
};
export const isAssetHierarchyQuery = (query: AssetQuery): query is AssetHierarchyQuery =>
  (query as AssetHierarchyQuery).assetHierarchyId != undefined;

export enum LoadingStateEnum {
  NOT_LOADED,
  LOADING,
  PAUSED,
  LOADED,
}

export const HIERARCHY_ROOT_ID = 'HIERARCHY_ROOT_ID';

export type CachedAssetSummaryBlock = {
  assetIds: string[],
  loadingStage: LoadingStateEnum,
  paginationToken: string | undefined
}

export type HierarchyAssetSummaryList = {
  assetHierarchyId: string,
  assets: AssetSummary[],
  loadingState: LoadingStateEnum,
}
