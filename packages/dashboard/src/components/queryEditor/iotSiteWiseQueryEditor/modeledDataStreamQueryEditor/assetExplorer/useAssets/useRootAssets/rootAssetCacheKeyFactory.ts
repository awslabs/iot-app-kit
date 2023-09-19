export class RootAssetCacheKeyFactory {
  create() {
    const cacheKey = [{ resource: 'root asset' }] as const;

    return cacheKey;
  }
}
