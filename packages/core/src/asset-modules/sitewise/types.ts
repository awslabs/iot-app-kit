/**
 * These are the types of high level queries that you can make to the asset module
 */
export type AssetQuery = {}

export type AssetSummaryQuery = AssetQuery & {
  assetId: string
}

export type AssetModelQuery = AssetQuery & {
  assetModelId: string
}

export type AssetPropertyValueQuery = AssetQuery & {
  assetId: string,
  propertyId: string
}

export type AssetHierarchyQuery = AssetQuery & {
  assetHierarchyId: string
}

