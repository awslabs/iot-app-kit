export class AssetModelCacheKeyFactory {
  create(assetModelId?: string) {
    return [{ resource: 'asset model', assetModelId }] as const;
  }
}
