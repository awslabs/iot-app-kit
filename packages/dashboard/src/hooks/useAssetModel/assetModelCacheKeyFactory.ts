export class AssetModelCacheKeyFactory {
  create(assetModelId?: string) {
    const cacheKey = [{ resource: 'asset model', assetModelId }] as const;

    return cacheKey;
  }
}
