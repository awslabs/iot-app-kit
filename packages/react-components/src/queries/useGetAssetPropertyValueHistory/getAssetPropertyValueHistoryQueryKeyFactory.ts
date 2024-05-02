export class AssetPropertyValueHistoryCacheKeyFactory {
  #assetId?: string;
  #propertyId?: string;
  #startDate?: Date;
  #endDate?: Date;
  #fetchAll?: boolean;

  constructor({
    assetId,
    propertyId,
    startDate,
    endDate,
    fetchAll,
  }: {
    assetId?: string;
    propertyId?: string;
    startDate?: Date;
    endDate?: Date;
    fetchAll?: boolean;
  }) {
    this.#assetId = assetId;
    this.#propertyId = propertyId;
    this.#startDate = startDate;
    this.#endDate = endDate;
    this.#fetchAll = fetchAll;
  }

  create() {
    const cacheKey = [
      {
        resource: 'asset property value history',
        assetId: this.#assetId,
        propertyId: this.#propertyId,
        startDate: this.#startDate?.getTime(),
        endDate: this.#endDate?.getTime(),
        fetchAll: this.#fetchAll,
      },
    ] as const;

    return cacheKey;
  }
}
