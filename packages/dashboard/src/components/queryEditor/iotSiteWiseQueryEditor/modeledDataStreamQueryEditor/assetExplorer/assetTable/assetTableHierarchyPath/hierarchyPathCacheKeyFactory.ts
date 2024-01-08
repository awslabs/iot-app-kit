export class HierarchyPathCacheKeyFactory {
  #assetId: string | undefined;

  constructor(assetId?: string) {
    this.#assetId = assetId;
  }

  create() {
    const cacheKey = [
      { resource: 'hierarchy path', assetId: this.#assetId },
    ] as const;

    return cacheKey;
  }
}
