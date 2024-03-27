export class DescribeAssetCacheKeyFactory {
  #assetId?: string;

  constructor({ assetId }: { assetId?: string }) {
    this.#assetId = assetId;
  }

  create() {
    const cacheKey = [
      { resource: 'describe asset', assetId: this.#assetId },
    ] as const;

    return cacheKey;
  }
}
