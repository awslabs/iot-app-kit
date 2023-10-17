export class AssetModelPropertiesCacheKeyFactory {
  #assetModelId: string | undefined;

  constructor(assetModelId?: string) {
    this.#assetModelId = assetModelId;
  }

  create() {
    const cacheKey = [{ resource: 'asset model properties', assetModelId: this.#assetModelId }] as const;

    return cacheKey;
  }
}
