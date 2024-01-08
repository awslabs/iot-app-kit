export class ChildAssetCacheKeyFactory {
  #assetId: string | undefined;

  constructor(assetId?: string) {
    this.#assetId = assetId;
  }

  create(hierarchyId: string) {
    const cacheKey = [
      { resource: 'child asset', assetId: this.#assetId, hierarchyId },
    ] as const;

    return cacheKey;
  }
}
