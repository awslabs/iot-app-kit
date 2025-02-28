export class DescribeAssetPropertyCacheKeyFactory {
  #assetId?: string;
  #propertyId?: string;

  constructor({
    assetId,
    propertyId,
  }: {
    assetId?: string;
    propertyId?: string;
  }) {
    this.#assetId = assetId;
    this.#propertyId = propertyId;
  }

  create() {
    const cacheKey = [
      {
        resource: 'describe asset property',
        assetId: this.#assetId,
        propertyId: this.#propertyId,
      },
    ] as const;

    return cacheKey;
  }
}
