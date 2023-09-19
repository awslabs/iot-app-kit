export class AssetCacheKeyFactory {
  #assetId: string | undefined;

  constructor(assetId?: string) {
    this.#assetId = assetId;
  }

  create() {
    const cacheKey = [{ resource: 'asset', assetId: this.#assetId }] as const;

    return cacheKey;
  }
}
