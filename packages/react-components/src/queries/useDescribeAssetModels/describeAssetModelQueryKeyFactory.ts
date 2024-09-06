export class DescribeAssetModelCacheKeyFactory {
  #assetModelId?: string;

  constructor({ assetModelId }: { assetModelId?: string }) {
    this.#assetModelId = assetModelId;
  }

  create() {
    const cacheKey = [
      { resource: 'describe asset model', assetModelId: this.#assetModelId },
    ] as const;

    return cacheKey;
  }
}
