/**
 * These are the types of high level queries that you can make to the asset module
 */
export type AssetQuery = {};

export type AssetSummaryQuery = AssetQuery & {
  assetId: string;
};
export const isAssetSummaryQuery = (query: AssetQuery): query is AssetSummaryQuery =>
  (query as AssetSummaryQuery).assetId != undefined;

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
  (query as AssetPropertyValueQuery).propertyId != undefined;

export type AssetHierarchyQuery = AssetQuery & {
  assetHierarchyId: string;
};
export const isAssetHierarchyQuery = (query: AssetQuery): query is AssetHierarchyQuery =>
  (query as AssetHierarchyQuery).assetHierarchyId != undefined;
