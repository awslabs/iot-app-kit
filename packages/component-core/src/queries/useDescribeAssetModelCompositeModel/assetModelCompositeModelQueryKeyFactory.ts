export class AssetModelCompositeModelCacheKeyFactory {
  #assetModelId?: string;
  #assetModelCompositeModelId?: string;

  constructor({
    assetModelId,
    assetModelCompositeModelId,
  }: {
    assetModelId?: string;
    assetModelCompositeModelId?: string;
  }) {
    this.#assetModelId = assetModelId;
    this.#assetModelCompositeModelId = assetModelCompositeModelId;
  }

  create() {
    const cacheKey = [
      {
        resource: 'asset model composite model',
        assetModelId: this.#assetModelId,
        assetModelCompositeModelId: this.#assetModelCompositeModelId,
      },
    ] as const;

    return cacheKey;
  }
}
