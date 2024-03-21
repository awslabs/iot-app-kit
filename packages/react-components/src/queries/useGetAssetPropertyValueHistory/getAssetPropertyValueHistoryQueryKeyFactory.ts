export class AssetPropertyValueHistoryCacheKeyFactory {
  #assetId?: string;
  #propertyId?: string;
  #startDate?: Date;
  #endDate?: Date;

  constructor({
    assetId,
    propertyId,
    startDate,
    endDate,
  }: {
    assetId?: string;
    propertyId?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    this.#assetId = assetId;
    this.#propertyId = propertyId;
    this.#startDate = startDate;
    this.#endDate = endDate;
  }

  create() {
    const cacheKey = [
      {
        resource: 'asset property value history',
        assetId: this.#assetId,
        propertyId: this.#propertyId,
        startDate: this.#startDate?.getTime(),
        endDate: this.#endDate?.getTime(),
      },
    ] as const;

    return cacheKey;
  }
}
